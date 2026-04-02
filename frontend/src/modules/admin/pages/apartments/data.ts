import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'ID',
    uid: 'id',
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
    name: 'bedrooms',
    label: 'Habitaciones',
    type: 'number',
    placeholder: 'Cantidad de habitaciones',
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
