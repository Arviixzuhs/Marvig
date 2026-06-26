import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DateRangePicker,
  type DateValue,
  type RangeValue,
} from '@heroui/react'
import { CalendarDate, parseDate } from '@internationalized/date'
import { I18nProvider } from '@react-aria/i18n'
import { FileDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { reportService } from '@/services/report'
import { IOccupancyReportFilter } from '@/models/ReportModel'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const OccupancyReportModal = ({ isOpen, onClose }: Props) => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]

  const [filters, setFilters] = useState<IOccupancyReportFilter>({
    fromDate: firstDay,
    toDate: lastDay,
  })
  const [pdfLoading, setPdfLoading] = useState(false)

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
      toast.error('Las fechas son obligatorias para el reporte de ocupación')
      return
    }
    setPdfLoading(true)
    try {
      const blob = await reportService.downloadOccupancyReportPdf(filters)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-ocupacion-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
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
            <FileDown className='w-5 h-5' />
          </div>
          <div>
            <p className='text-base font-semibold'>Reporte de Ocupación</p>
            <p className='text-xs text-default-500 font-normal'>
              Genera y descarga la ocupación y ganancias por apartamento en formato PDF
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className='w-full mb-4'>
            <I18nProvider locale='es'>
              <DateRangePicker
                label='Rango de ocupación'
                size='sm'
                isRequired
                value={getDateRangeValue()}
                onChange={handleChangeDateRange}
                aria-label='Rango de fechas para el reporte de ocupación'
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
