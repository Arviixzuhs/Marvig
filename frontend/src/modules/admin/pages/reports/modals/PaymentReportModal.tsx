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
import { generatePaymentReportPdf } from '@/utils/reportPdfGenerator'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { IPaymentReportFilter, IPaymentReportPage } from '@/models/ReportModel'
import { PaymentStatus } from '@/models/PaymentModel'

const STATUS_COLORS: Record<
  PaymentStatus,
  'success' | 'warning' | 'danger' | 'default'
> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  FAILED: 'danger',
  CANCELLED: 'default',
}

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
    page: 0,
    pageSize: 10,
  })
  const [data, setData] = useState<IPaymentReportPage | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleSearch = async (page = 0) => {
    setLoading(true)
    try {
      const result = await reportService.getPaymentReport({
        ...filters,
        page,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      })
      setData(result)
    } catch {
      toast.error('Error al obtener el reporte de pagos')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPdf = async () => {
    if (!data) return
    setPdfLoading(true)
    try {
      generatePaymentReportPdf(data, { fromDate: filters.fromDate, toDate: filters.toDate })
      toast.success('PDF generado correctamente')
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
            <p className='text-base font-semibold'>Reporte de Pagos</p>
            <p className='text-xs text-default-500 font-normal'>
              Consulta y exporta el historial de pagos
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
          {/* Filters */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4'>
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
              startContent={<Search className='w-4 h-4 text-default-400' />}
              value={filters.search}
              onValueChange={(v) => setFilters((f) => ({ ...f, search: v }))}
            />
          </div>

          {/* Results */}
          {loading ? (
            <div className='flex justify-center py-12'>
              <Spinner size='lg' />
            </div>
          ) : data ? (
            <>
              {/* Summary chips */}
              <div className='flex flex-wrap gap-2 mb-3'>
                <Chip size='sm' variant='flat' color='default'>
                  {data.totalItems} registros
                </Chip>
                <Chip size='sm' variant='flat' color='success'>
                  Total:{' '}
                  {formatCurrency(data.content.reduce((s, p) => s + p.amount, 0))}
                </Chip>
              </div>

              <div className='overflow-x-auto'>
                <Table aria-label='Tabla de pagos' removeWrapper>
                  <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>FECHA</TableColumn>
                    <TableColumn>MONTO</TableColumn>
                    <TableColumn>ESTADO</TableColumn>
                    <TableColumn>MÉTODO</TableColumn>
                    <TableColumn>REFERENCIA</TableColumn>
                    <TableColumn>CLIENTE</TableColumn>
                    <TableColumn>APARTAMENTO</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {data.content.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className='text-xs text-default-500'>
                          #{p.id}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {formatDate(p.date)}
                        </TableCell>
                        <TableCell className='font-medium text-sm'>
                          {formatCurrency(p.amount)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size='sm'
                            color={STATUS_COLORS[p.status]}
                            variant='flat'
                          >
                            {STATUS_LABELS[p.status]}
                          </Chip>
                        </TableCell>
                        <TableCell className='text-sm'>{p.method}</TableCell>
                        <TableCell className='text-sm text-default-500'>
                          {p.reference || '—'}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {p.reservation?.clientName || '—'}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {p.reservation?.apartments
                            ?.map((a) => `#${a.number}`)
                            .join(', ') || '—'}
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
          <Button variant='flat' onPress={onClose} className='sm:order-1'>
            Cerrar
          </Button>
          <Button
            color='primary'
            variant='flat'
            onPress={() => handleSearch(0)}
            isLoading={loading}
            className='sm:order-2'
          >
            Generar reporte
          </Button>
          {data && (
            <Button
              color='success'
              onPress={handleExportPdf}
              isLoading={pdfLoading}
              startContent={<FileDown className='w-4 h-4' />}
              className='sm:order-3'
            >
              Exportar PDF
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
