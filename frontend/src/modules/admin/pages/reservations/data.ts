import { RentalType, ReservationStatus } from '@/models/ReservationModel'
import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'Nombre del cliente',
    uid: 'clientName',
    style: 'user',
  },
  {
    name: 'Inicio',
    uid: 'startDate',
    style: 'date',
  },
  {
    name: 'Fin',
    uid: 'endDate',
    style: 'date',
  },
  {
    name: 'Tipo',
    uid: 'type',
    style: 'chip',
    chipConfig: {
      [RentalType.DAILY]: { label: 'Diario', color: '#3B82F6' },
      [RentalType.FIXED_SEASON]: { label: 'Temporada', color: '#8B5CF6' },
    },
  },
  {
    name: 'Estado',
    uid: 'status',
    style: 'chip',
    chipConfig: {
      [ReservationStatus.PENDING]: { label: 'Pendiente', color: '#F59E0B' },
      [ReservationStatus.CONFIRMED]: { label: 'Confirmado', color: '#10B981' },
      [ReservationStatus.CANCELLED]: { label: 'Cancelado', color: '#EF4444' },
      [ReservationStatus.COMPLETED]: { label: 'Completado', color: '#6B7280' },
    },
  },
  {
    name: 'Precio Total',
    uid: 'totalPrice',
    style: 'currency',
  },
  {
    name: 'Acciones',
    uid: 'actions',
  },
]

export const modalInputs: ModalInput[] = [
  {
    name: 'clientName',
    label: 'Nombre del Cliente',
    type: 'text',
    placeholder: 'Nombre completo',
    required: true,
  },
  {
    name: 'clientEmail',
    label: 'Email del Cliente',
    type: 'email',
    placeholder: 'correo@ejemplo.com',
    required: false,
  },
  {
    name: 'clientPhone',
    label: 'Teléfono del Cliente',
    type: 'text',
    placeholder: '+34 000 000 000',
    required: false,
  },
  {
    name: 'startDate',
    label: 'Fecha de Inicio',
    type: 'date',
    placeholder: 'Selecciona fecha de inicio',
    required: true,
  },
  {
    name: 'endDate',
    label: 'Fecha de Fin',
    type: 'date',
    placeholder: 'Selecciona fecha de fin',
    required: true,
  },
  {
    name: 'type',
    label: 'Tipo de Renta',
    type: 'select',
    placeholder: 'Selecciona tipo',
    required: true,
    options: [
      { label: 'Diario', value: RentalType.DAILY },
      { label: 'Temporada Fija', value: RentalType.FIXED_SEASON },
    ],
  },
  {
    name: 'status',
    label: 'Estado',
    type: 'select',
    required: true,
    placeholder: 'Estado inicial',
    options: [
      { label: 'Pendiente', value: ReservationStatus.PENDING },
      { label: 'Confirmado', value: ReservationStatus.CONFIRMED },
      { label: 'Cancelado', value: ReservationStatus.CANCELLED },
      { label: 'Completado', value: ReservationStatus.COMPLETED },
    ],
  },
]
