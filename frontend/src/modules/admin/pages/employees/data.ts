import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'Nombre',
    uid: 'name',
  },
  {
    name: 'Apellido',
    uid: 'lastName',
  },
  {
    name: 'Telefono',
    uid: 'phone',
  },
  {
    name: 'Correo',
    uid: 'email',
  },
  {
    name: 'Dirección',
    uid: 'address',
  },
  {
    name: 'Dirección',
    uid: 'address',
  },
  {
    name: 'Acciones',
    uid: 'actions',
  },
]

export const modalInputs: ModalInput[] = [
  {
    name: 'name',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ingresa el nombre',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Apellido',
    type: 'text',
    placeholder: 'Ingresa el apellido',
    required: true,
  },
  {
    name: 'phone',
    label: 'Telefono',
    type: 'text',
    placeholder: 'Ingresa el telefono',
    required: true,
  },
  {
    name: 'email',
    label: 'Correo',
    type: 'text',
    placeholder: 'Ingresa el correo',
    required: false,
  },
  {
    name: 'address',
    label: 'Dirección',
    type: 'text',
    placeholder: 'Ingresa la dirección',
    required: false,
  },
]
