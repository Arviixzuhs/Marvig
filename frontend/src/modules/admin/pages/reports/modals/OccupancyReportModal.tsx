import { useEffect, useState } from 'react'
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
  Selection,
} from '@heroui/react'
import { FileDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { reportService } from '@/services/report'
import { IOccupancyReportFilter } from '@/models/ReportModel'
import { apartmentService } from '@/services/apartment'
import { ApartmentModel } from '@/models/ApartmentModel'

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
  const [apartments, setApartments] = useState<ApartmentModel[]>([])
  const [selectedApartments, setSelectedApartments] = useState<Selection>(new Set([]))
  const [loadingApartments, setLoadingApartments] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const fetchApartments = async () => {
        setLoadingApartments(true)
        try {
          const res = await apartmentService.getAll({ page: 0, pageSize: 100 })
          if (res && res.content) {
            setApartments(res.content)
          }
        } catch (error) {
          console.error('Error fetching apartments:', error)
          toast.error('No se pudieron cargar los apartamentos')
        } finally {
          setLoadingApartments(false)
        }
      }
      fetchApartments()
    } else {
      setSelectedApartments(new Set([]))
    }
  }, [isOpen])

  const handleExportPdf = async () => {
    if (!filters.fromDate || !filters.toDate) {
      toast.error('Las fechas son obligatorias para el reporte de ocupación')
      return
    }
    setPdfLoading(true)
    try {
      const apartmentIds = selectedApartments === 'all'
        ? undefined
        : Array.from(selectedApartments).map((id) => Number(id))

      const blob = await reportService.downloadOccupancyReportPdf({
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        apartmentIds: apartmentIds && apartmentIds.length > 0 ? apartmentIds : undefined,
      })
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
            <Select
              label='Filtrar por Apartamento(s)'
              placeholder='Todos los apartamentos'
              selectionMode='multiple'
              size='sm'
              selectedKeys={selectedApartments}
              onSelectionChange={setSelectedApartments}
              isLoading={loadingApartments}
              className='col-span-1 sm:col-span-2'
            >
              {apartments.map((apt) => (
                <SelectItem key={apt.id.toString()} textValue={`#${apt.number} (Piso ${apt.floor})`}>
                  #{apt.number} (Piso {apt.floor})
                </SelectItem>
              ))}
            </Select>
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
