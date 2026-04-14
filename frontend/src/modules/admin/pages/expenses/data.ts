import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'
import { ExpenseCategory } from '@/models/ExpenseModel'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'Monto',
    uid: 'amount',
    style: 'currency',
  },
  {
    name: 'Descripción',
    uid: 'description',
  },
  {
    name: 'Categoría',
    uid: 'category',
    style: 'chip',
    chipConfig: {
      [ExpenseCategory.MAINTENANCE]: { label: 'Mantenimiento', color: '#F59E0B' },
      [ExpenseCategory.UTILITIES]: { label: 'Servicios', color: '#3B82F6' },
      [ExpenseCategory.CLEANING]: { label: 'Limpieza', color: '#10B981' },
      [ExpenseCategory.TAXES]: { label: 'Impuestos', color: '#EF4444' },
      [ExpenseCategory.SUPPLIES]: { label: 'Suministros', color: '#8B5CF6' },
      [ExpenseCategory.OTHER]: { label: 'Otros', color: '#6B7280' },
    },
  },
  {
    name: 'Acciones',
    uid: 'actions',
  },
]

export const modalInputs: ModalInput[] = [
  {
    name: 'amount',
    label: 'Monto',
    type: 'float',
    placeholder: '0.00',
    required: true,
  },
  {
    name: 'description',
    label: 'Descripción',
    type: 'text',
    placeholder: 'Motivo del gasto...',
    required: false,
  },
  {
    name: 'category',
    label: 'Categoría',
    type: 'select',
    required: true,
    options: [
      { label: 'Mantenimiento', value: ExpenseCategory.MAINTENANCE },
      { label: 'Servicios', value: ExpenseCategory.UTILITIES },
      { label: 'Limpieza', value: ExpenseCategory.CLEANING },
      { label: 'Impuestos', value: ExpenseCategory.TAXES },
      { label: 'Suministros', value: ExpenseCategory.SUPPLIES },
      { label: 'Otros', value: ExpenseCategory.OTHER },
    ],
  },
]
