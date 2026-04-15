import { ApartmentStatus } from '@/models/ApartmentModel'
import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'Precio por Día',
    uid: 'pricePerDay',
    style: 'currency',
  },
  {
    name: 'Piso',
    uid: 'floor',
  },
  {
    name: 'Número',
    uid: 'number',
  },
  {
    name: 'Habitaciones',
    uid: 'bedrooms',
  },
  {
    name: 'Baños',
    uid: 'bathrooms',
  },
  {
    name: 'M² Totales',
    uid: 'squareMeters',
  },
  {
    name: 'Estado',
    uid: 'status',
    style: 'chip',
    chipConfig: {
      [ApartmentStatus.AVAILABLE]: { color: '#10B981', label: 'Disponible' },
      [ApartmentStatus.OCCUPIED]: { color: '#EF4444', label: 'Ocupado' },
      [ApartmentStatus.RESERVED]: { color: '#3B82F6', label: 'Reservado' },
      [ApartmentStatus.MAINTENANCE]: { color: '#F59E0B', label: 'En Mantenimiento' },
    },
  },
  {
    name: 'Acciones',
    uid: 'actions',
  },
]

export const modalInputs: ModalInput[] = [
  {
    name: 'floor',
    label: 'Piso',
    type: 'number',
    placeholder: 'Ej: 1',
    required: true,
  },
  {
    name: 'number',
    label: 'Número de Apartmento',
    type: 'text',
    placeholder: 'Ej: A-101',
    required: true,
  },
  {
    name: 'status',
    placeholder: 'Selecciona el estado del apartamento',
    label: 'Estado del Apartamento',
    type: 'select',
    required: true,
    options: [
      { value: ApartmentStatus.AVAILABLE, label: 'Disponible' },
      { value: ApartmentStatus.OCCUPIED, label: 'Ocupado' },
      { value: ApartmentStatus.RESERVED, label: 'Reservado' },
      { value: ApartmentStatus.MAINTENANCE, label: 'En Mantenimiento' },
    ],
  },
  {
    name: 'bedrooms',
    label: 'Habitaciones',
    type: 'number',
    placeholder: 'Cantidad de habitaciones',
    required: true,
  },
  {
    name: 'pricePerDay',
    label: 'Precio por día',
    type: 'number',
    placeholder: 'Precio por dóa',
    required: true,
  },
  {
    name: 'bathrooms',
    label: 'Baños',
    type: 'number',
    placeholder: 'Cantidad de baños',
    required: true,
  },
  {
    name: 'squareMeters',
    label: 'Metros Cuadrados',
    type: 'number',
    placeholder: 'Ej: 65.5',
    required: false,
  },
]
