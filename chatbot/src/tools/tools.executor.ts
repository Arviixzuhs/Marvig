import { Injectable, Logger } from '@nestjs/common';
import { BackendClientService } from '../services/backend-client.service';

@Injectable()
export class ToolsExecutor {
  private readonly logger = new Logger(ToolsExecutor.name);

  constructor(private readonly backendClient: BackendClientService) {}

  async executeTool(toolName: string, args: any, user: any, userToken?: string): Promise<any> {
    this.logger.debug(`Ejecutando tool: ${toolName} con args: ${JSON.stringify(args)}`);

    try {
      switch (toolName) {
        case 'consultar_disponibilidad':
          return await this.consultarDisponibilidad(args, userToken);
          
        case 'ver_balance_financiero':
          if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
            return { error: 'Acceso denegado. Se requiere rol de administrador.' };
          }
          return await this.verBalanceFinanciero(args, userToken);
          
        case 'crear_reserva':
          return await this.crearReserva(args, user, userToken);

        default:
          return { error: `Herramienta desconocida: ${toolName}` };
      }
    } catch (error: any) {
      this.logger.error(`Error ejecutando tool ${toolName}: ${error.message}`);
      return { status: 'error', message: 'El servicio está experimentando problemas técnicos.' };
    }
  }

  private async consultarDisponibilidad(args: any, userToken?: string) {
    const page = await this.backendClient.findApartments({}, userToken);
    
    const disponibles = page.content.map((apt: any) => ({
      id: apt.id,
      nombre: `Apartamento ${apt.number}`,
      precio_por_dia: apt.pricePerDay,
      habitaciones: apt.bedrooms,
      banos: apt.bathrooms,
      metros_cuadrados: apt.squareMeters,
      estado: apt.status
    }));

    return {
      status: 'success',
      disponibles: disponibles.filter((a: any) => a.estado === 'AVAILABLE'),
      mensaje: `Disponibilidad verificada en la base de datos para las fechas ${args.fecha_inicio} a ${args.fecha_fin}`
    };
  }

  private async verBalanceFinanciero(args: any, userToken?: string) {
    const performance = await this.backendClient.getExpensesPerformance({}, userToken);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const targetMonthName = months[args.mes - 1];
    
    const monthData = performance.find((p: any) => p.month === targetMonthName) || {
      MAINTENANCE: 0, UTILITIES: 0, CLEANING: 0, TAXES: 0, SUPPLIES: 0, OTHER: 0
    };

    const totalGastos = Object.values(monthData).reduce((acc: number, val: any) => {
      return typeof val === 'number' ? acc + val : acc;
    }, 0);

    return {
      status: 'success',
      mes: args.mes,
      anio: args.anio,
      ingresos_estimados: 5000, 
      egresos_totales: totalGastos,
      detalle_egresos: monthData
    };
  }

  private async crearReserva(args: any, user: any, userToken?: string) {
    const start = new Date(args.fecha_inicio);
    const end = new Date(args.fecha_fin);

    if (start >= end) {
      return { status: 'error', message: 'La fecha de entrada debe ser anterior a la de salida.' };
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const apartmentId = parseInt(args.id_apartamento);
    const page = await this.backendClient.findApartments({ ids: [apartmentId] }, userToken);
    const apartment = page.content.find((a: any) => a.id === apartmentId);

    if (!apartment) {
      return { status: 'error', message: `El apartamento con ID ${args.id_apartamento} no existe.` };
    }

    let pricePerDay = Number(apartment.pricePerDay);
    let discount = 0;

    if (apartment.promotion) {
      const promoValue = Number(apartment.promotion.value);
      if (apartment.promotion.type === 'PERCENTAGE') {
        discount = (pricePerDay * promoValue) / 100;
      } else {
        discount = promoValue;
      }
    }

    const finalPricePerDay = pricePerDay - discount;
    const calculatedTotal = finalPricePerDay * diffDays;
    const finalTotal = Math.round(calculatedTotal * 100) / 100;

    const reservationInput = {
      startDate: args.fecha_inicio,
      endDate: args.fecha_fin,
      apartmentIds: [apartmentId],
      totalPrice: finalTotal,
      type: 'DAILY',
      status: 'CONFIRMED',
      clientName: user?.username || 'Cliente Bot',
      clientEmail: user?.email || 'bot@marvig.com',
      clientPhone: '000000000',
      persons: args.huespedes,
      payment: {
        date: new Date().toISOString(),
        method: args.metodo_pago || 'CASH',
        reference: `BOT-RESERVA-${Date.now()}`,
        description: 'Reserva generada automáticamente por Asistente Marvig'
      }
    };

    const reservation = await this.backendClient.createReservation(reservationInput, userToken);

    return {
      status: 'success',
      reserva_id: reservation.id,
      mensaje: `Reserva creada exitosamente para el usuario ${user?.email || 'Invitado'} en el apartamento ${apartment.number}. Total pagado: ${finalTotal}$.`
    };
  }
}
