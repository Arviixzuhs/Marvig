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
import { generateExpenseReportPdf } from '@/utils/reportPdfGenerator'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { IExpenseReportFilter, IExpenseReportPage } from '@/models/ReportModel'
import { ExpenseCategory } from '@/models/ExpenseModel'

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  MAINTENANCE: 'Mantenimiento',
  UTILITIES: 'Servicios',
  CLEANING: 'Limpieza',
  TAXES: 'Impuestos',
  SUPPLIES: 'Suministros',
  OTHER: 'Otro',
}

const CATEGORY_COLORS: Record<
  ExpenseCategory,
  'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
> = {
  MAINTENANCE: 'warning',
  UTILITIES: 'primary',
  CLEANING: 'success',
  TAXES: 'danger',
  SUPPLIES: 'secondary',
  OTHER: 'default',
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const ExpenseReportModal = ({ isOpen, onClose }: Props) => {
  const [filters, setFilters] = useState<IExpenseReportFilter>({
    fromDate: '',
    toDate: '',
    category: undefined,
    search: '',
    page: 0,
    pageSize: 10,
  })
  const [data, setData] = useState<IExpenseReportPage | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleSearch = async (page = 0) => {
    setLoading(true)
    try {
      const result = await reportService.getExpenseReport({
        ...filters,
        page,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        category: filters.category || undefined,
        search: filters.search || undefined,
      })
      setData(result)
    } catch {
      toast.error('Error al obtener el reporte de gastos')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPdf = async () => {
    if (!data) return
    setPdfLoading(true)
    try {
      generateExpenseReportPdf(data, { fromDate: filters.fromDate, toDate: filters.toDate })
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
            <p className='text-base font-semibold'>Reporte de Gastos</p>
            <p className='text-xs text-default-500 font-normal'>
              Análisis de egresos por categoría y apartamento
            </p>
          </div>
        </ModalHeader>

        <ModalBody>
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
              label='Categoría'
              size='sm'
              selectedKeys={filters.category ? [filters.category] : []}
              onSelectionChange={(keys) => {
                const val = [...keys][0] as ExpenseCategory | undefined
                setFilters((f) => ({ ...f, category: val }))
              }}
            >
              {Object.values(ExpenseCategory).map((c) => (
                <SelectItem key={c}>{CATEGORY_LABELS[c]}</SelectItem>
              ))}
            </Select>
            <Input
              label='Buscar'
              size='sm'
              placeholder='Descripción...'
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
                  {data.totalItems} registros
                </Chip>
                <Chip size='sm' variant='flat' color='danger'>
                  Total gastos:{' '}
                  {formatCurrency(data.content.reduce((s, e) => s + e.amount, 0))}
                </Chip>
              </div>

              <div className='overflow-x-auto'>
                <Table aria-label='Tabla de gastos' removeWrapper>
                  <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>FECHA</TableColumn>
                    <TableColumn>MONTO</TableColumn>
                    <TableColumn>CATEGORÍA</TableColumn>
                    <TableColumn>DESCRIPCIÓN</TableColumn>
                    <TableColumn>APARTAMENTO</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {data.content.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className='text-xs text-default-500'>
                          #{e.id}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {e.date ? formatDate(e.date) : '—'}
                        </TableCell>
                        <TableCell className='font-medium text-sm'>
                          {formatCurrency(e.amount)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size='sm'
                            color={CATEGORY_COLORS[e.category]}
                            variant='flat'
                          >
                            {CATEGORY_LABELS[e.category]}
                          </Chip>
                        </TableCell>
                        <TableCell className='text-sm text-default-500 max-w-[200px] truncate'>
                          {e.description || '—'}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {e.apartment
                            ? `#${e.apartment.number} (Piso ${e.apartment.floor})`
                            : '—'}
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
