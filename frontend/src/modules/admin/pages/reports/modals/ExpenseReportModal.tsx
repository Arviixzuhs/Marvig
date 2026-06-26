import { ExpenseCategory } from '@/models/ExpenseModel'
import { IExpenseReportFilter } from '@/models/ReportModel'
import { reportService } from '@/services/report'
import {
  Button,
  DateRangePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  type DateValue,
  type RangeValue,
} from '@heroui/react'
import { CalendarDate, parseDate } from '@internationalized/date'
import { I18nProvider } from '@react-aria/i18n'
import { FileDown } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

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

export const ExpenseReportModal = ({ isOpen, onClose }: Props) => {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [filters, setFilters] = useState<IExpenseReportFilter>({
    fromDate: '',
    toDate: '',
    category: undefined,
    search: '',
  })

  const getDateRangeValue = (): RangeValue<CalendarDate> | undefined => {
    if (filters.fromDate && filters.toDate) {
      return {
        start: parseDate(filters.fromDate),
        end: parseDate(filters.toDate),
      }
    }
    return undefined
  }

  const handleChangeDateRange = (value: RangeValue<DateValue> | null) => {
    if (!value || !value.start || !value.end) {
      setFilters((f) => ({ ...f, fromDate: '', toDate: '' }))
      return
    }
    setFilters((f) => ({
      ...f,
      fromDate: value.start.toString(),
      toDate: value.end.toString(),
    }))
  }

  const handleExportPdf = async () => {
    setPdfLoading(true)
    try {
      await reportService.downloadExpenseReportPdf({
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        category: filters.category || undefined,
        search: filters.search || undefined,
      })
      toast.success('PDF descargado correctamente')
    } catch {
      toast.error('Error al generar el PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='2xl' scrollBehavior='inside' backdrop='blur'>
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className='p-2 rounded-xl bg-default-100'>
            <FileDown className='w-5 h-5' />
          </div>
          <div>
            <p className='text-base font-semibold'>Reporte de Gastos</p>
            <p className='text-xs text-default-500 font-normal'>
              Genera y descarga el análisis de egresos en formato PDF
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4'>
            <div className='col-span-1 sm:col-span-2'>
              <I18nProvider locale='es'>
                <DateRangePicker
                  label='Rango de fechas'
                  size='sm'
                  value={getDateRangeValue()}
                  onChange={handleChangeDateRange}
                  aria-label='Rango de fechas para reporte de gastos'
                  className='w-full'
                />
              </I18nProvider>
            </div>
            <Select
              label='Categoría'
              size='sm'
              selectedKeys={filters.category ? [filters.category] : []}
              onSelectionChange={(keys) => {
                const val = [...keys][0] as ExpenseCategory | undefined
                setFilters((f) => ({ ...f, category: val }))
              }}
            >
              {Object.values(ExpenseCategory).map((c) => (
                <SelectItem key={c}>{CATEGORY_LABELS[c]}</SelectItem>
              ))}
            </Select>
            <Input
              label='Buscar'
              size='sm'
              placeholder='Descripción...'
              value={filters.search}
              onValueChange={(v) => setFilters((f) => ({ ...f, search: v }))}
            />
          </div>
        </ModalBody>
        <ModalFooter className='flex gap-2'>
          <Button variant='flat' onPress={onClose} className='w-full'>
            Cerrar
          </Button>
          <Button
            color='primary'
            onPress={handleExportPdf}
            isLoading={pdfLoading}
            className='w-full'
            startContent={!pdfLoading && <FileDown className='w-4 h-4' />}
          >
            Descargar PDF
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
