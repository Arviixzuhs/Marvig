import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'ID',
    uid: 'id',
  },
  {
    name: 'Inicio',
    uid: 'startDate',
  },
  {
    name: 'Fin',
    uid: 'endDate',
  },
  {
    name: 'Tipo',
    uid: 'type',
  },
  {
    name: 'Estado',
    uid: 'status',
  },
  {
    name: 'Precio Total',
    uid: 'totalPrice',
  },
  {
    name: 'Acciones',
    uid: 'actions',
  },
]

export const modalInputs: ModalInput[] = [
  {
    name: 'userId',
    label: 'ID de Usuario',
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
  },
  {
    name: 'status',
    label: 'Estado',
    type: 'select',
    placeholder: 'Estado inicial',
    required: true,
  },
  {
    name: 'totalPrice',
    label: 'Precio Total',
    type: 'number',
    placeholder: '0.00',
    required: true,
  },
]
