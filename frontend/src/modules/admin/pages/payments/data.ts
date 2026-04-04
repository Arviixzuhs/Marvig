import { PaymentMethod, PaymentStatus } from '@/models/PaymentModel'
import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'Monto',
    uid: 'amount',
  },
  {
    name: 'Método',
    uid: 'method',
  },
  {
    name: 'Referencia',
    uid: 'reference',
  },
  {
    name: 'Estado',
    uid: 'status',
  },
  {
    name: 'Fecha',
    uid: 'date',
  },
]

export const modalInputs: ModalInput[] = [
  {
    name: 'reservationId',
    label: 'Reserva (ID)',
    type: 'number',
    placeholder: 'ID de la reserva',
    required: true,
  },
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
    type: 'text',
    placeholder: 'Notas adicionales...',
    required: false,
  },
]
