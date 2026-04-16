import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Receipt,
  Building,
  Megaphone,
  Users,
  UserCog,
  FileBarChart,
  ArrowRight,
} from 'lucide-react'

const reportsModules = [
  {
    title: 'Dashboard',
    description: 'Resumen general del rendimiento del sistema, ingresos y actividad.',
    icon: LayoutDashboard,
    color: 'primary',
    metrics: ['Ventas', 'Ganancias', 'Actividad'],
  },
  {
    title: 'Reservas',
    description: 'Estadísticas de reservas por fecha, ocupación y cancelaciones.',
    icon: CalendarCheck,
    color: 'success',
    metrics: ['Reservas totales', 'Ocupación', 'Cancelaciones'],
  },
  {
    title: 'Pagos',
    description: 'Análisis de pagos recibidos, métodos de pago y transacciones.',
    icon: CreditCard,
    color: 'secondary',
    metrics: ['Ingresos', 'Transacciones', 'Pagos pendientes'],
  },
  {
    title: 'Gastos',
    description: 'Control de gastos por categoría como mantenimiento o servicios.',
    icon: Receipt,
    color: 'danger',
    metrics: ['Gastos totales', 'Categorías', 'Balance'],
  },
  {
    title: 'Apartamentos',
    description: 'Rendimiento de propiedades, disponibilidad y rentabilidad.',
    icon: Building,
    color: 'warning',
    metrics: ['Ocupación', 'Ingresos', 'Disponibilidad'],
  },
  {
    title: 'Promociones',
    description: 'Impacto de promociones y campañas en las reservas.',
    icon: Megaphone,
    color: 'primary',
    metrics: ['Conversiones', 'Descuentos', 'ROI'],
  },
  {
    title: 'Usuarios',
    description: 'Actividad de usuarios, registros y comportamiento.',
    icon: Users,
    color: 'success',
    metrics: ['Usuarios activos', 'Nuevos registros', 'Retención'],
  },
  {
    title: 'Empleados',
    description: 'Desempeño del personal y productividad operativa.',
    icon: UserCog,
    color: 'secondary',
    metrics: ['Productividad', 'Turnos', 'Tareas'],
  },
  {
    title: 'Reportes Generales',
    description: 'Exportación y análisis completo de datos del sistema.',
    icon: FileBarChart,
    color: 'default',
    metrics: ['Reportes', 'Exportaciones', 'Historial'],
  },
]

export const AdminReportsPage = () => {
  return (
    <div className='w-full'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {reportsModules.map((module, index) => {
          const Icon = module.icon

          return (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card shadow='none' className='h-full rounded-2xl'>
                <CardHeader className='flex items-start justify-between pb-2'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-xl bg-default-100'>
                      <Icon className='w-5 h-5' />
                    </div>

                    <div>
                      <h3 className='text-base font-medium leading-none'>{module.title}</h3>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className='pt-0 flex flex-col justify-between h-full'>
                  <div>
                    <p className='text-sm text-default-500 mb-4'>{module.description}</p>

                    <div className='flex flex-wrap gap-2 mb-5'>
                      {module.metrics.map((metric) => (
                        <Chip key={metric} size='sm' variant='flat'>
                          {metric}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant='flat'
                    endContent={<ArrowRight className='w-4 h-4' />}
                    className='w-full justify-between font-medium'
                  >
                    Ver reporte
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
