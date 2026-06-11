import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
  Progress,
} from '@heroui/react'
import { FileDown, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { reportService } from '@/services/report'
import { generateIncomeSummaryPdf } from '@/utils/reportPdfGenerator'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { IExpenseByCategory, IIncomeSummary, IIncomeSummaryFilter } from '@/models/ReportModel'
import { ExpenseCategory } from '@/models/ExpenseModel'

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  MAINTENANCE: 'Mantenimiento',
  UTILITIES: 'Servicios',
  CLEANING: 'Limpieza',
  TAXES: 'Impuestos',
  SUPPLIES: 'Suministros',
  OTHER: 'Otro',
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const IncomeSummaryModal = ({ isOpen, onClose }: Props) => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split('T')[0]
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0]

  const [filters, setFilters] = useState<IIncomeSummaryFilter>({
    fromDate: firstDay,
    toDate: lastDay,
  })
  const [data, setData] = useState<IIncomeSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleSearch = async () => {
    if (!filters.fromDate || !filters.toDate) {
      toast.error('Las fechas son obligatorias')
      return
    }
    setLoading(true)
    try {
      const result = await reportService.getIncomeSummary(filters)
      setData(result)
    } catch {
      toast.error('Error al obtener el resumen de ingresos')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPdf = async () => {
    if (!data) return
    setPdfLoading(true)
    try {
      generateIncomeSummaryPdf(data, filters)
      toast.success('PDF generado correctamente')
    } catch {
      toast.error('Error al generar el PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  const isProfitable = (data?.netProfit ?? 0) >= 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='2xl'
      scrollBehavior='inside'
      classNames={{ base: 'max-h-[90vh]' }}
    >
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className='p-2 rounded-xl bg-default-100'>
            <DollarSign className='w-5 h-5' />
          </div>
          <div>
            <p className='text-base font-semibold'>Resumen de Ingresos</p>
            <p className='text-xs text-default-500 font-normal'>
              Ingresos, egresos y ganancia neta del período
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          {/* Date range — required */}
          <div className='grid grid-cols-2 gap-3 mb-4'>
            <Input
              label='Desde *'
              type='date'
              size='sm'
              isRequired
              value={filters.fromDate}
              onValueChange={(v) => setFilters((f) => ({ ...f, fromDate: v }))}
            />
            <Input
              label='Hasta *'
              type='date'
              size='sm'
              isRequired
              value={filters.toDate}
              onValueChange={(v) => setFilters((f) => ({ ...f, toDate: v }))}
            />
          </div>

          {loading ? (
            <div className='flex justify-center py-12'>
              <Spinner size='lg' />
            </div>
          ) : data ? (
            <>
              {/* Period label */}
              <p className='text-xs text-default-400 text-center mb-4'>
                {formatDate(filters.fromDate)} — {formatDate(filters.toDate)}
              </p>

              {/* Key metrics */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5'>
                <div className='rounded-xl bg-success-50 border border-success-200 p-4'>
                  <div className='flex items-center gap-2 mb-1'>
                    <TrendingUp className='w-4 h-4 text-success-600' />
                    <p className='text-xs text-success-700 uppercase tracking-wide font-medium'>
                      Ingresos
                    </p>
                  </div>
                  <p className='text-xl font-bold text-success-700'>
                    {formatCurrency(data.totalIncome)}
                  </p>
                  <p className='text-xs text-success-500 mt-1'>
                    Pagos confirmados
                  </p>
                </div>

                <div className='rounded-xl bg-danger-50 border border-danger-200 p-4'>
                  <div className='flex items-center gap-2 mb-1'>
                    <TrendingDown className='w-4 h-4 text-danger-600' />
                    <p className='text-xs text-danger-700 uppercase tracking-wide font-medium'>
                      Egresos
                    </p>
                  </div>
                  <p className='text-xl font-bold text-danger-700'>
                    {formatCurrency(data.totalExpenses)}
                  </p>
                  <p className='text-xs text-danger-500 mt-1'>
                    Gastos del período
                  </p>
                </div>

                <div
                  className={`rounded-xl p-4 border ${
                    isProfitable
                      ? 'bg-primary-50 border-primary-200'
                      : 'bg-warning-50 border-warning-200'
                  }`}
                >
                  <div className='flex items-center gap-2 mb-1'>
                    <BarChart3
                      className={`w-4 h-4 ${isProfitable ? 'text-primary-600' : 'text-warning-600'}`}
                    />
                    <p
                      className={`text-xs uppercase tracking-wide font-medium ${isProfitable ? 'text-primary-700' : 'text-warning-700'}`}
                    >
                      Ganancia neta
                    </p>
                  </div>
                  <p
                    className={`text-xl font-bold ${isProfitable ? 'text-primary-700' : 'text-warning-700'}`}
                  >
                    {formatCurrency(data.netProfit)}
                  </p>
                  <p
                    className={`text-xs mt-1 ${isProfitable ? 'text-primary-500' : 'text-warning-500'}`}
                  >
                    {isProfitable ? '✓ Rentabilidad positiva' : '⚠ Pérdida neta'}
                  </p>
                </div>
              </div>

              {/* Expenses breakdown */}
              {data.expensesByCategory.length > 0 && (
                <div>
                  <p className='text-sm font-semibold mb-3 text-default-700'>
                    Desglose de gastos por categoría
                  </p>
                  <div className='space-y-3'>
                    {data.expensesByCategory.map((e: IExpenseByCategory) => (
                      <div key={e.category}>
                        <div className='flex justify-between items-center mb-1'>
                          <span className='text-sm text-default-600'>
                            {CATEGORY_LABELS[e.category as ExpenseCategory] ||
                              e.category}
                          </span>
                          <div className='flex items-center gap-3'>
                            <span className='text-sm font-medium'>
                              {formatCurrency(e.amount)}
                            </span>
                            <span className='text-xs text-default-400 w-10 text-right'>
                              {e.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={e.percentage}
                          size='sm'
                          color='danger'
                          aria-label={e.category}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='text-center py-12 text-default-400'>
              <DollarSign className='w-12 h-12 mx-auto mb-3 opacity-30' />
              <p className='text-sm'>
                Selecciona un rango de fechas y haz clic en{' '}
                <strong>Generar reporte</strong>
              </p>
            </div>
          )}
        </ModalBody>

        <ModalFooter className='flex-wrap gap-2'>
          <Button variant='flat' onPress={onClose}>
            Cerrar
          </Button>
          <Button
            color='primary'
            variant='flat'
            onPress={handleSearch}
            isLoading={loading}
          >
            Generar reporte
          </Button>
          {data && (
            <Button
              color='success'
              onPress={handleExportPdf}
              isLoading={pdfLoading}
              startContent={<FileDown className='w-4 h-4' />}
            >
              Exportar PDF
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
