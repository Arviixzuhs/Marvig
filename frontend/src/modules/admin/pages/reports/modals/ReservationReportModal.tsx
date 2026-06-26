import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  DateRangePicker,
  type DateValue,
  type RangeValue,
} from '@heroui/react'
import { parseDate, CalendarDate } from '@internationalized/date'
import { I18nProvider } from '@react-aria/i18n'
import { FileDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { reportService } from '@/services/report'
import { IReservationReportFilter } from '@/models/ReportModel'
import { ReservationStatus } from '@/models/ReservationModel'

const STATUS_LABELS: Record<ReservationStatus, string> = {
  CONFIRMED: 'Confirmada',
  PENDING: 'Pendiente',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const ReservationReportModal = ({ isOpen, onClose }: Props) => {
  const [filters, setFilters] = useState<IReservationReportFilter>({
    startDate: '',
    endDate: '',
    status: undefined,
    search: '',
  })
  const [pdfLoading, setPdfLoading] = useState(false)

  const getDateRangeValue = (): RangeValue<CalendarDate> | undefined => {
    if (filters.startDate && filters.endDate) {
      return {
        start: parseDate(filters.startDate),
        end: parseDate(filters.endDate),
      }
    }
    return undefined
  }

  const handleChangeDateRange = (value: RangeValue<DateValue> | null) => {
    if (!value || !value.start || !value.end) {
      setFilters((f) => ({ ...f, startDate: '', endDate: '' }))
      return
    }
    setFilters((f) => ({
      ...f,
      startDate: value.start.toString(),
      endDate: value.end.toString(),
    }))
  }

  const handleExportPdf = async () => {
    setPdfLoading(true)
    try {
      await reportService.downloadReservationReportPdf({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
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
            <p className='text-base font-semibold'>Reporte de Reservas</p>
            <p className='text-xs text-default-500 font-normal'>
              Genera y descarga el detalle de reservas y cobros en formato PDF
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4'>
            <div className='col-span-1 sm:col-span-2'>
              <I18nProvider locale='es'>
                <DateRangePicker
                  label='Rango de fechas de entrada'
                  size='sm'
                  value={getDateRangeValue()}
                  onChange={handleChangeDateRange}
                  aria-label='Rango de fechas para reporte de reservas'
                  className='w-full'
                />
              </I18nProvider>
            </div>
            <Select
              label='Estado'
              size='sm'
              selectedKeys={filters.status ? [filters.status] : []}
              onSelectionChange={(keys) => {
                const val = [...keys][0] as ReservationStatus | undefined
                setFilters((f) => ({ ...f, status: val }))
              }}
            >
              {Object.values(ReservationStatus).map((s) => (
                <SelectItem key={s}>{STATUS_LABELS[s]}</SelectItem>
              ))}
            </Select>
            <Input
              label='Buscar'
              size='sm'
              placeholder='Cliente, email...'
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
