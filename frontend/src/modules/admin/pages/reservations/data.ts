import { RentalType, ReservationStatus } from '@/models/ReservationModel'
import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
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
    name: 'userId',
    label: 'ID de la reser',
    type: 'number',
    placeholder: 'ID del cliente',
    required: true,
  },
  {
    name: 'apartmentId',
    label: 'ID de Apartamento',
    type: 'number',
    placeholder: 'ID del inmueble',
    required: true,
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
  {
    name: 'totalPrice',
    label: 'Precio Total',
    type: 'number',
    placeholder: '0.00',
    required: true,
  },
]
