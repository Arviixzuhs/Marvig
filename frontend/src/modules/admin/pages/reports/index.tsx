import { useState } from 'react'
import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Receipt,
  CalendarCheck,
  Building2,
  TrendingUp,
  ArrowRight,
  FileBarChart2,
} from 'lucide-react'
import { PaymentReportModal } from './modals/PaymentReportModal'
import { ExpenseReportModal } from './modals/ExpenseReportModal'
import { ReservationReportModal } from './modals/ReservationReportModal'
import { OccupancyReportModal } from './modals/OccupancyReportModal'
import { IncomeSummaryModal } from './modals/IncomeSummaryModal'

type ReportKey = 'payment' | 'expense' | 'reservation' | 'occupancy' | 'income' | null

interface IReportCard {
  key: Exclude<ReportKey, null>
  title: string
  description: string
  icon: React.ElementType
  metrics: string[]
  accentClass: string
}

const REPORT_CARDS: IReportCard[] = [
  {
    key: 'payment',
    title: 'Reporte de Pagos',
    description:
      'Historial de todos los pagos registrados. Filtra por estado, fecha y cliente. Incluye el apartamento y la reserva relacionada.',
    icon: CreditCard,
    metrics: ['Todos los estados', 'Rango de fechas', 'Por cliente'],
    accentClass: 'text-accent bg-[#eff6ff] dark:bg-[#141f36]',
  },
  {
    key: 'expense',
    title: 'Reporte de Gastos',
    description:
      'Análisis de egresos por categoría como mantenimiento, limpieza, impuestos y más. Filtra por apartamento o rango de fechas.',
    icon: Receipt,
    metrics: ['Por categoría', 'Por apartamento', 'Rango de fechas'],
    accentClass: 'text-destructive bg-[#fee2e2] dark:bg-[#2c1616]',
  },
  {
    key: 'reservation',
    title: 'Reporte de Reservas',
    description:
      'Estado de cobros de cada reserva: total cobrado, pendiente y pagos asociados. Incluye información de cliente y apartamentos.',
    icon: CalendarCheck,
    metrics: ['Cobrado vs pendiente', 'Pagos asociados', 'Por estado'],
    accentClass: 'text-[#047857] dark:text-[#6ee7b7] bg-[#d1fae5] dark:bg-[#13271d]',
  },
  {
    key: 'occupancy',
    title: 'Reporte de Ocupación',
    description:
      'Tabla de ocupación por apartamento: noches disponibles, ocupadas y bloqueadas con porcentaje de ocupación e ingresos generados.',
    icon: Building2,
    metrics: ['Noches ocupadas', '% Ocupación', 'Ingresos por apt.'],
    accentClass: 'text-[#6d28d9] dark:text-[#a78bfa] bg-[#ede9fe] dark:bg-[#201933]',
  },
  {
    key: 'income',
    title: 'Resumen de Ingresos',
    description:
      'Vista ejecutiva con ingresos confirmados, total de gastos, ganancia neta y desglose de egresos por categoría.',
    icon: TrendingUp,
    metrics: ['Ingresos totales', 'Gastos totales', 'Ganancia neta'],
    accentClass: 'text-[#b45309] dark:text-[#fcd34d] bg-[#fef3c7] dark:bg-[#282015]',
  },
]

export const AdminReportsPage = () => {
  const [activeReport, setActiveReport] = useState<ReportKey>(null)

  return (
    <>
      <div className='w-full'>
        {/* Section header */}
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2.5 rounded-xl bg-default-100'>
            <FileBarChart2 className='w-5 h-5' />
          </div>
          <div>
            <h1 className='text-lg font-semibold leading-tight'>Reportes del Sistema</h1>
            <p className='text-sm text-default-500'>
              Selecciona un módulo para generar y exportar reportes
            </p>
          </div>
        </div>

        {/* Report cards grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {REPORT_CARDS.map((report, index) => {
            const Icon = report.icon

            return (
              <motion.div
                key={report.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Card
                  shadow='none'
                  className='h-full rounded-2xl  hover:shadow-sm transition-all duration-200 cursor-pointer group'
                  isPressable
                  onPress={() => setActiveReport(report.key)}
                >
                  <CardHeader className='flex items-start justify-between pb-2'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`p-2.5 rounded-xl ${report.accentClass} transition-transform duration-200 group-hover:scale-110`}
                      >
                        <Icon className='w-5 h-5' />
                      </div>
                      <div>
                        <h3 className='text-base font-semibold leading-tight'>{report.title}</h3>
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody className='pt-0 flex flex-col justify-between h-full'>
                    <div>
                      <p className='text-sm text-default-500 mb-4 leading-relaxed'>
                        {report.description}
                      </p>

                      <div className='flex flex-wrap gap-1.5 mb-5'>
                        {report.metrics.map((metric) => (
                          <Chip key={metric} size='sm' variant='flat'>
                            {metric}
                          </Chip>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant='flat'
                      endContent={
                        <ArrowRight className='w-4 h-4 transition-transform duration-200 group-hover:translate-x-1' />
                      }
                      className='w-full justify-between font-medium'
                      onPress={() => setActiveReport(report.key)}
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

      {/* Modals */}
      <PaymentReportModal
        isOpen={activeReport === 'payment'}
        onClose={() => setActiveReport(null)}
      />
      <ExpenseReportModal
        isOpen={activeReport === 'expense'}
        onClose={() => setActiveReport(null)}
      />
      <ReservationReportModal
        isOpen={activeReport === 'reservation'}
        onClose={() => setActiveReport(null)}
      />
      <OccupancyReportModal
        isOpen={activeReport === 'occupancy'}
        onClose={() => setActiveReport(null)}
      />
      <IncomeSummaryModal
        isOpen={activeReport === 'income'}
        onClose={() => setActiveReport(null)}
      />
    </>
  )
}
