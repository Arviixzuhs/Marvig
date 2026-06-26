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
import { IExpenseReportFilter } from '@/models/ReportModel'
import { ExpenseCategory } from '@/models/ExpenseModel'

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  MAINTENANCE: 'Mantenimiento',
  UTILITIES: 'Servicios',
  CLEANING: 'Limpieza',
  TAXES: 'Impuestos',
  SUPPLIES: 'Suministros',
  OTHER: 'Otro',
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
  })
  const [pdfLoading, setPdfLoading] = useState(false)

  const handleExportPdf = async () => {
    setPdfLoading(true)
    try {
      const blob = await reportService.downloadExpenseReportPdf({
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        category: filters.category || undefined,
        search: filters.search || undefined,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-gastos-${Date.now()}.pdf`
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
    <Modal isOpen={isOpen} onClose={onClose} size='2xl' scrollBehavior='inside' backdrop='blur'>
      <ModalContent>
        <ModalHeader className='flex items-center gap-3'>
          <div className='p-2 rounded-xl bg-default-100'>
            <FileDown className='w-5 h-5' />
          </div>
          <div>
            <p className='text-base font-semibold'>Reporte de Gastos</p>
            <p className='text-xs text-default-500 font-normal'>
              Genera y descarga el análisis de egresos en formato PDF
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
