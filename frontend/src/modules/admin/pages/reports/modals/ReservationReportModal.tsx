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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Spinner,
} from '@heroui/react'
import { FileDown, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { reportService } from '@/services/report'
import { generateReservationReportPdf } from '@/utils/reportPdfGenerator'
import { formatCurrency, formatDate } from '@/utils/formatters'
import {
  IReservationReportFilter,
  IReservationReportPage,
} from '@/models/ReportModel'
import { ReservationStatus } from '@/models/ReservationModel'

const STATUS_COLORS: Record<
  ReservationStatus,
  'success' | 'warning' | 'danger' | 'default'
> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  CANCELLED: 'danger',
  COMPLETED: 'default',
}

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
    page: 0,
    pageSize: 10,
  })
  const [data, setData] = useState<IReservationReportPage | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleSearch = async (page = 0) => {
    setLoading(true)
    try {
      const result = await reportService.getReservationReport({
        ...filters,
        page,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      })
      setData(result)
    } catch {
      toast.error('Error al obtener el reporte de reservas')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPdf = async () => {
    if (!data) return
    setPdfLoading(true)
    try {
      generateReservationReportPdf(data, {
        startDate: filters.startDate,
        endDate: filters.endDate,
      })
      toast.success('PDF generado correctamente')
    } catch {
      toast.error('Error al generar el PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  const totalPaid = data?.content.reduce((s, r) => s + r.totalPaid, 0) ?? 0
  const totalPending =
    data?.content.reduce((s, r) => s + r.pendingAmount, 0) ?? 0

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
            <p className='text-base font-semibold'>Reporte de Reservas</p>
            <p className='text-xs text-default-500 font-normal'>
              Estado de cobros y detalle de reservas
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4'>
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
              startContent={<Search className='w-4 h-4 text-default-400' />}
              value={filters.search}
              onValueChange={(v) => setFilters((f) => ({ ...f, search: v }))}
            />
          </div>

          {loading ? (
            <div className='flex justify-center py-12'>
              <Spinner size='lg' />
            </div>
          ) : data ? (
            <>
              <div className='flex flex-wrap gap-2 mb-3'>
                <Chip size='sm' variant='flat'>
                  {data.totalItems} reservas
                </Chip>
                <Chip size='sm' variant='flat' color='success'>
                  Cobrado: {formatCurrency(totalPaid)}
                </Chip>
                <Chip size='sm' variant='flat' color='warning'>
                  Pendiente: {formatCurrency(totalPending)}
                </Chip>
              </div>

              <div className='overflow-x-auto'>
                <Table aria-label='Tabla de reservas' removeWrapper>
                  <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>ENTRADA</TableColumn>
                    <TableColumn>SALIDA</TableColumn>
                    <TableColumn>ESTADO</TableColumn>
                    <TableColumn>CLIENTE</TableColumn>
                    <TableColumn>APTS</TableColumn>
                    <TableColumn>TOTAL</TableColumn>
                    <TableColumn>PAGADO</TableColumn>
                    <TableColumn>PENDIENTE</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {data.content.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className='text-xs text-default-500'>
                          #{r.id}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {formatDate(r.startDate)}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {formatDate(r.endDate)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size='sm'
                            color={STATUS_COLORS[r.status]}
                            variant='flat'
                          >
                            {STATUS_LABELS[r.status]}
                          </Chip>
                        </TableCell>
                        <TableCell className='text-sm'>
                          {r.clientName || '—'}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {r.apartments.map((a) => `#${a.number}`).join(', ') ||
                            '—'}
                        </TableCell>
                        <TableCell className='text-sm font-medium'>
                          {formatCurrency(r.totalPrice)}
                        </TableCell>
                        <TableCell className='text-sm text-success-600 font-medium'>
                          {formatCurrency(r.totalPaid)}
                        </TableCell>
                        <TableCell className='text-sm text-warning-600 font-medium'>
                          {formatCurrency(r.pendingAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data.totalPages > 1 && (
                <div className='flex justify-center mt-4'>
                  <Pagination
                    total={data.totalPages}
                    page={data.currentPage + 1}
                    onChange={(page) => handleSearch(page - 1)}
                    size='sm'
                  />
                </div>
              )}
            </>
          ) : (
            <div className='text-center py-12 text-default-400'>
              <FileDown className='w-12 h-12 mx-auto mb-3 opacity-30' />
              <p className='text-sm'>
                Configura los filtros y haz clic en{' '}
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
            onPress={() => handleSearch(0)}
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
