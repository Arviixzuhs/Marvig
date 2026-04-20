import { PaymentMethod } from '@/models/PaymentModel'
import { ExpenseCategory } from '@/models/ExpenseModel'
import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

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
    name: 'Método de pago',
    uid: 'paymentMethod',
    style: 'chip',
    chipConfig: {
      [PaymentMethod.CASH]: { label: 'Efectivo', color: '#4B5563' },
      [PaymentMethod.PAYPAL]: { label: 'PayPal', color: '#003087' },
      [PaymentMethod.STRIPE]: { label: 'Stripe', color: '#635BFF' },
      [PaymentMethod.PAGO_MOVIL]: { label: 'Pago Móvil', color: '#8B5CF6' },
      [PaymentMethod.DEBIT_CARD]: { label: 'T. Débito', color: '#3B82F6' },
      [PaymentMethod.CREDID_CARD]: { label: 'T. Crédito', color: '#1E40AF' },
      [PaymentMethod.BANK_TRANSFER]: { label: 'Transferencia', color: '#10B981' },
    },
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
    name: 'Fecha',
    uid: 'date',
    style: 'date',
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
    name: 'date',
    label: 'Fecha',
    type: 'date',
    required: true,
  },
  {
    name: 'paymentMethod',
    label: 'Método de Pago',
    type: 'select',
    required: true,
    options: [
      { label: 'Efectivo', value: PaymentMethod.CASH },
      { label: 'PayPal', value: PaymentMethod.PAYPAL },
      { label: 'Stripe', value: PaymentMethod.STRIPE },
      { label: 'Pago Móvil', value: PaymentMethod.PAGO_MOVIL },
      { label: 'Tarjeta de Débito', value: PaymentMethod.DEBIT_CARD },
      { label: 'Tarjeta de Crédito', value: PaymentMethod.CREDID_CARD },
      { label: 'Transferencia Bancaria', value: PaymentMethod.BANK_TRANSFER },
    ],
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
  {
    name: 'description',
    label: 'Descripción',
    type: 'textarea',
    placeholder: 'Motivo del gasto...',
    required: false,
  },
]
