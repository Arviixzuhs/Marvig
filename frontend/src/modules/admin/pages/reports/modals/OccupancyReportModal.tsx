import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@heroui/react'
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
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split('T')[0]
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0]

  const [filters, setFilters] = useState<IOccupancyReportFilter>({
    fromDate: firstDay,
    toDate: lastDay,
  })
  const [pdfLoading, setPdfLoading] = useState(false)

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='xl'
      scrollBehavior='inside'
    >
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
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4'>
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
