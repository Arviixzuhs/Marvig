import { PaymentMethod, PaymentStatus } from '@/models/PaymentModel'
import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'Monto',
    uid: 'amount',
    style: 'currency',
  },
  {
    name: 'Método',
    uid: 'method',
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
    name: 'Referencia',
    uid: 'reference',
  },
  {
    name: 'Estado',
    uid: 'status',
    style: 'chip',
    chipConfig: {
      [PaymentStatus.PENDING]: { label: 'Pendiente', color: '#F59E0B' },
      [PaymentStatus.CONFIRMED]: { label: 'Confirmado', color: '#10B981' },
      [PaymentStatus.FAILED]: { label: 'Fallido', color: '#EF4444' },
      [PaymentStatus.CANCELLED]: { label: 'Cancelado', color: '#6B7280' },
    },
  },
  {
    name: 'Fecha',
    uid: 'date',
    style: 'date',
  },
]

export const modalInputs: ModalInput[] = [
  {
    name: 'amount',
    label: 'Monto del Pago',
    type: 'float',
    placeholder: '0.00',
    required: true,
  },
  {
    name: 'method',
    label: 'Método de Pago',
    type: 'select',
    placeholder: 'Selecciona un método',
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
    name: 'status',
    label: 'Estado del Pago',
    type: 'select',
    placeholder: 'Selecciona el estado',
    required: true,
    options: [
      { label: 'Pendiente', value: PaymentStatus.PENDING },
      { label: 'Confirmado', value: PaymentStatus.CONFIRMED },
      { label: 'Fallido', value: PaymentStatus.FAILED },
      { label: 'Cancelado', value: PaymentStatus.CANCELLED },
    ],
  },
  {
    name: 'reference',
    label: 'Referencia / Confirmación',
    type: 'text',
    placeholder: 'Número de operación',
    required: true,
  },
  {
    name: 'date',
    label: 'Fecha de Pago',
    type: 'date',
    required: true,
  },
  {
    name: 'description',
    label: 'Descripción',
    type: 'textarea',
    placeholder: 'Notas adicionales...',
    required: false,
  },
]
