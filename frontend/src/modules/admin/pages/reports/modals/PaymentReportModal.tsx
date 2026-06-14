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
import { IPaymentReportFilter } from '@/models/ReportModel'
import { PaymentStatus } from '@/models/PaymentModel'

const STATUS_LABELS: Record<PaymentStatus, string> = {
  CONFIRMED: 'Confirmado',
  PENDING: 'Pendiente',
  FAILED: 'Fallido',
  CANCELLED: 'Cancelado',
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const PaymentReportModal = ({ isOpen, onClose }: Props) => {
  const [filters, setFilters] = useState<IPaymentReportFilter>({
    fromDate: '',
    toDate: '',
    status: undefined,
    search: '',
  })
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleExportPdf = async () => {
    setPdfLoading(true)
    try {
      const blob = await reportService.downloadPaymentReportPdf({
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-pagos-${Date.now()}.pdf`
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
            <p className='text-base font-semibold'>Reporte de Pagos</p>
            <p className='text-xs text-default-500 font-normal'>
              Genera y descarga el historial de pagos en formato PDF
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4'>
            <Input
              label='Desde'
              type='date'
              size='sm'
              value={filters.fromDate}
              onValueChange={(v) => setFilters((f) => ({ ...f, fromDate: v }))}
            />
            <Input
              label='Hasta'
              type='date'
              size='sm'
              value={filters.toDate}
              onValueChange={(v) => setFilters((f) => ({ ...f, toDate: v }))}
            />
            <Select
              label='Estado'
              size='sm'
              selectedKeys={filters.status ? [filters.status] : []}
              onSelectionChange={(keys) => {
                const val = [...keys][0] as PaymentStatus | undefined
                setFilters((f) => ({ ...f, status: val }))
              }}
            >
              {Object.values(PaymentStatus).map((s) => (
                <SelectItem key={s}>{STATUS_LABELS[s]}</SelectItem>
              ))}
            </Select>
            <Input
              label='Buscar'
              size='sm'
              placeholder='Referencia, cliente...'
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
