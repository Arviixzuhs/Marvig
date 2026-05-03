import { ToolDeclaration } from '../interfaces/chatbot.interface';

export const CHATBOT_TOOLS: Record<string, ToolDeclaration> = {
  consultar_disponibilidad: {
    name: 'consultar_disponibilidad',
    description: 'Consulta la disponibilidad de apartamentos para un rango de fechas y número de huéspedes.',
    parameters: {
      properties: {
        fecha_inicio: { type: 'string', description: 'Fecha de inicio en formato YYYY-MM-DD' },
        fecha_fin: { type: 'string', description: 'Fecha de fin en formato YYYY-MM-DD' },
        huespedes: { type: 'number', description: 'Número de huéspedes esperados' }
      },
      required: ['fecha_inicio', 'fecha_fin', 'huespedes']
    }
  },
  ver_balance_financiero: {
    name: 'ver_balance_financiero',
    description: 'Obtiene un reporte financiero de ingresos y egresos de la posada. Exclusivo para administradores.',
    parameters: {
      properties: {
        mes: { type: 'number', description: 'Mes numérico (1-12)' },
        anio: { type: 'number', description: 'Año (ej: 2026)' }
      },
      required: ['mes', 'anio']
    }
  },
  crear_reserva: {
    name: 'crear_reserva',
    description: 'Crea una reserva temporal para un apartamento específico.',
    parameters: {
      properties: {
        id_apartamento: { type: 'string', description: 'ID del apartamento' },
        fecha_inicio: { type: 'string', description: 'Fecha de inicio (YYYY-MM-DD)' },
        fecha_fin: { type: 'string', description: 'Fecha de fin (YYYY-MM-DD)' },
        huespedes: { type: 'number', description: 'Número de huéspedes' }
      },
      required: ['id_apartamento', 'fecha_inicio', 'fecha_fin', 'huespedes']
    }
  }
};

export const getToolsForRole = (role: string): ToolDeclaration[] => {
  const clientTools = [
    CHATBOT_TOOLS.consultar_disponibilidad,
    CHATBOT_TOOLS.crear_reserva,
  ];
  
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return [...clientTools, CHATBOT_TOOLS.ver_balance_financiero];
  }
  
  return clientTools;
};
