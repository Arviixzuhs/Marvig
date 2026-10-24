import { PaymentMethod, PaymentStatus } from '@/models/PaymentModel'
import { ReservationStatus } from '@/models/ReservationModel'

export const reservationStatusChip: Record<
  ReservationStatus,
  {
    label: string
    color: string
  }
> = {
  [ReservationStatus.FAILED]: {
    label: 'Fallido',
    color: '#c2410c',
  },
  [ReservationStatus.PENDING]: {
    label: 'Pendiente',
    color: '#F59E0B',
  },
  [ReservationStatus.CONFIRMED]: {
    label: 'Confirmado',
    color: '#10B981',
  },
  [ReservationStatus.CANCELLED]: {
    label: 'Cancelado',
    color: '#EF4444',
  },
  [ReservationStatus.COMPLETED]: {
    label: 'Completado',
    color: '#6B7280',
  },
}

export const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: 'warning' | 'success' | 'danger' | 'default' }
> = {
  [PaymentStatus.PENDING]: { label: 'Pendiente', color: 'warning' },
  [PaymentStatus.CONFIRMED]: { label: 'Confirmado', color: 'success' },
  [PaymentStatus.FAILED]: { label: 'Fallido', color: 'danger' },
  [PaymentStatus.CANCELLED]: { label: 'Cancelado', color: 'default' },
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.PAYPAL]: 'PayPal',
  [PaymentMethod.STRIPE]: 'Stripe',
  [PaymentMethod.PAGO_MOVIL]: 'Pago Móvil',
  [PaymentMethod.DEBIT_CARD]: 'Tarjeta de Débito',
  [PaymentMethod.CREDID_CARD]: 'Tarjeta de Crédito',
  [PaymentMethod.BANK_TRANSFER]: 'Transferencia Bancaria',
}
