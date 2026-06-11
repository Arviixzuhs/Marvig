import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Progress,
} from '@heroui/react'
import { FileDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { reportService } from '@/services/report'
import { generateOccupancyReportPdf } from '@/utils/reportPdfGenerator'
import { formatCurrency } from '@/utils/formatters'
import { IApartmentOccupancy, IOccupancyReport, IOccupancyReportFilter } from '@/models/ReportModel'

interface Props {
  isOpen: boolean
  onClose: () => void
}

function OccupancyBar({ value }: { value: number }) {
  const color =
    value >= 75 ? 'success' : value >= 40 ? 'warning' : 'danger'
  return (
    <div className='flex items-center gap-2 min-w-[120px]'>
      <Progress
        value={value}
        color={color}
        size='sm'
        className='flex-1'
        aria-label='Ocupación'
      />
      <span className='text-xs font-medium w-10 text-right'>
        {value.toFixed(1)}%
      </span>
    </div>
  )
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
  const [data, setData] = useState<IOccupancyReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleSearch = async () => {
    if (!filters.fromDate || !filters.toDate) {
      toast.error('Las fechas son obligatorias para el reporte de ocupación')
      return
    }
    setLoading(true)
    try {
      const result = await reportService.getOccupancyReport(filters)
      setData(result)
    } catch {
      toast.error('Error al obtener el reporte de ocupación')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPdf = async () => {
    if (!data) return
    setPdfLoading(true)
    try {
      generateOccupancyReportPdf(data)
      toast.success('PDF generado correctamente')
    } catch {
      toast.error('Error al generar el PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  const avgOccupancy = data
    ? data.apartments.reduce((s, a) => s + a.occupancyPercentage, 0) /
      (data.apartments.length || 1)
    : 0
  const totalIncome = data
    ? data.apartments.reduce((s, a) => s + a.generatedIncome, 0)
    : 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='5xl'
      scrollBehavior='inside'
      classNames={{ base: 'max-h-[90vh]' }}
    >
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className='p-2 rounded-xl bg-default-100'>
            <FileDown className='w-5 h-5' />
          </div>
          <div>
            <p className='text-base font-semibold'>Reporte de Ocupación</p>
            <p className='text-xs text-default-500 font-normal'>
              Noches disponibles, ocupadas, bloqueadas y ganancias por apartamento
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          {/* Required date filters */}
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

          {loading ? (
            <div className='flex justify-center py-12'>
              <Spinner size='lg' />
            </div>
          ) : data ? (
            <>
              {/* Summary */}
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4'>
                <div className='rounded-xl bg-default-50 border border-default-200 p-4 text-center'>
                  <p className='text-xs text-default-500 uppercase tracking-wide mb-1'>
                    Apartamentos
                  </p>
                  <p className='text-2xl font-bold'>
                    {data.apartments.length}
                  </p>
                </div>
                <div className='rounded-xl bg-default-50 border border-default-200 p-4 text-center'>
                  <p className='text-xs text-default-500 uppercase tracking-wide mb-1'>
                    Ocupación promedio
                  </p>
                  <p className='text-2xl font-bold text-primary'>
                    {avgOccupancy.toFixed(1)}%
                  </p>
                </div>
                <div className='rounded-xl bg-default-50 border border-default-200 p-4 text-center col-span-2 sm:col-span-1'>
                  <p className='text-xs text-default-500 uppercase tracking-wide mb-1'>
                    Ingresos generados
                  </p>
                  <p className='text-2xl font-bold text-success-600'>
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
              </div>

              <div className='overflow-x-auto'>
                <Table aria-label='Tabla de ocupación' removeWrapper>
                  <TableHeader>
                    <TableColumn>APARTAMENTO</TableColumn>
                    <TableColumn>PISO</TableColumn>
                    <TableColumn>TOTAL NOCHES</TableColumn>
                    <TableColumn>OCUPADAS</TableColumn>
                    <TableColumn>BLOQUEADAS</TableColumn>
                    <TableColumn>DISPONIBLES</TableColumn>
                    <TableColumn>% OCUPACIÓN</TableColumn>
                    <TableColumn>INGRESOS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {data.apartments.map((a: IApartmentOccupancy) => (
                      <TableRow key={a.apartmentId}>
                        <TableCell className='font-medium text-sm'>
                          #{a.apartmentNumber}
                        </TableCell>
                        <TableCell className='text-sm'>
                          Piso {a.floor}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {a.totalNights}
                        </TableCell>
                        <TableCell>
                          <Chip size='sm' color='success' variant='flat'>
                            {a.occupiedNights}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip size='sm' color='warning' variant='flat'>
                            {a.blockedNights}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Chip size='sm' color='default' variant='flat'>
                            {a.availableNights}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <OccupancyBar value={a.occupancyPercentage} />
                        </TableCell>
                        <TableCell className='font-medium text-sm text-success-600'>
                          {formatCurrency(a.generatedIncome)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className='text-center py-12 text-default-400'>
              <FileDown className='w-12 h-12 mx-auto mb-3 opacity-30' />
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
