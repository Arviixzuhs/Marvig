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
} from '@heroui/react'
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

  const handleExportPdf = async () => {
    setPdfLoading(true)
    try {
      const blob = await reportService.downloadReservationReportPdf({
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-reservas-${Date.now()}.pdf`
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='2xl'
      scrollBehavior='inside'
    >
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
            <Input
              label='Fecha de entrada desde'
              type='date'
              size='sm'
              value={filters.startDate}
              onValueChange={(v) => setFilters((f) => ({ ...f, startDate: v }))}
            />
            <Input
              label='Fecha de entrada hasta'
              type='date'
              size='sm'
              value={filters.endDate}
              onValueChange={(v) => setFilters((f) => ({ ...f, endDate: v }))}
            />
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

        <ModalFooter className='flex-wrap gap-2'>
          <Button variant='flat' onPress={onClose}>
            Cerrar
          </Button>
          <Button
            color='success'
            onPress={handleExportPdf}
            isLoading={pdfLoading}
            startContent={!pdfLoading && <FileDown className='w-4 h-4' />}
          >
            Descargar PDF
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
