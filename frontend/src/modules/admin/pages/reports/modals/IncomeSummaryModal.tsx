import toast from 'react-hot-toast'
import { useState } from 'react'
import { I18nProvider } from '@react-aria/i18n'
import { reportService } from '@/services/report'
import { FileDown, DollarSign } from 'lucide-react'
import { IIncomeSummaryFilter } from '@/models/ReportModel'
import { CalendarDate, parseDate } from '@internationalized/date'
import {
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  type DateValue,
  type RangeValue,
  ModalFooter,
  ModalContent,
  DateRangePicker,
} from '@heroui/react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const IncomeSummaryModal = ({ isOpen, onClose }: Props) => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]
  const [pdfLoading, setPdfLoading] = useState(false)
  const [filters, setFilters] = useState<IIncomeSummaryFilter>({
    fromDate: firstDay,
    toDate: lastDay,
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
    if (!filters.fromDate || !filters.toDate) {
      toast.error('Las fechas son obligatorias')
      return
    }
    setPdfLoading(true)
    try {
      await reportService.downloadIncomeSummaryPdf(filters)
      toast.success('PDF descargado correctamente')
    } catch {
      toast.error('Error al generar el PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl' scrollBehavior='inside' backdrop='blur'>
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className='p-2 rounded-xl bg-default-100'>
            <DollarSign className='w-5 h-5' />
          </div>
          <div>
            <p className='text-base font-semibold'>Resumen de Ingresos</p>
            <p className='text-xs text-default-500 font-normal'>
              Genera y descarga el resumen de ingresos, egresos y ganancia neta en formato PDF
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='w-full mb-4'>
            <I18nProvider locale='es'>
              <DateRangePicker
                label='Rango del reporte'
                size='sm'
                isRequired
                value={getDateRangeValue()}
                onChange={handleChangeDateRange}
                aria-label='Rango de fechas para el resumen de ingresos'
                className='w-full'
              />
            </I18nProvider>
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
