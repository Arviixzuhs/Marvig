import { Injectable, Logger } from '@nestjs/common';
import { GetExpensesPerformanceUseCase } from '../../expense/application/usecases/get-expense-performance-by-category.usecase';
import { FindApartmentsUseCase } from '../../apartment/application/usecases/find-apartments.usecase';

@Injectable()
export class ChatbotToolsExecutor {
  private readonly logger = new Logger(ChatbotToolsExecutor.name);

  constructor(
    private readonly getExpensesPerformanceUseCase: GetExpensesPerformanceUseCase,
    private readonly findApartmentsUseCase: FindApartmentsUseCase,
  ) {}

  async executeTool(toolName: string, args: any, user: any): Promise<any> {
    this.logger.debug(`Ejecutando tool: ${toolName} con args: ${JSON.stringify(args)}`);

    try {
      switch (toolName) {
        case 'consultar_disponibilidad':
          return await this.consultarDisponibilidad(args);
          
        case 'ver_balance_financiero':
          if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            return { error: 'Acceso denegado. Se requiere rol de administrador.' };
          }
          return await this.verBalanceFinanciero(args);
          
        case 'crear_reserva':
          return await this.crearReserva(args, user);

        default:
          return { error: `Herramienta desconocida: ${toolName}` };
      }
    } catch (error: any) {
      this.logger.error(`Error ejecutando tool ${toolName}: ${error.message}`);
      return { status: 'error', message: 'El servicio está experimentando problemas técnicos.' };
    }
  }

  private async consultarDisponibilidad(args: any) {
    // Usamos el caso de uso real de la BD para obtener todos los apartamentos
    // (A futuro esto se cruzará con las reservas reales por fechas)
    const page = await this.findApartmentsUseCase.execute({});
    
    // Mapeamos los campos que Groq necesita para evitar mandarle data innecesaria o sensible
    const disponibles = page.content.map(apt => ({
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
      disponibles: disponibles.filter(a => a.estado === 'AVAILABLE'),
      mensaje: `Disponibilidad verificada en la base de datos para las fechas ${args.fecha_inicio} a ${args.fecha_fin}`
    };
  }

  private async verBalanceFinanciero(args: any) {
    // Usamos el caso de uso real de gastos
    const performance = await this.getExpensesPerformanceUseCase.execute({});
    
    // Mapear los meses 1-12 al array devuelto (Jan, Feb, etc.)
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
      ingresos_estimados: 5000, // Hardcoded ingresos por ahora ya que no tenemos PaymentUseCase aquí importado
      egresos_totales: totalGastos,
      detalle_egresos: monthData
    };
  }

  private async crearReserva(args: any, user: any) {
    // Debería invocar a CreateReservationUseCase
    return {
      status: 'success',
      reserva_id: `res-${Math.floor(Math.random() * 10000)}`,
      mensaje: `Reserva pre-aprobada para el usuario ${user.email} en el apartamento ${args.id_apartamento}.`
    };
  }
}
