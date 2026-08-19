import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'Nombre',
    uid: 'name',
    style: 'user',
  },
  {
    name: 'Apellido',
    uid: 'lastName',
  },
  {
    name: 'Teléfono',
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
    name: 'Acciones',
    uid: 'actions',
  },
]

export const modalInputs: ModalInput[] = [
  {
    name: 'name',
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ej: Gabriela',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Apellido',
    type: 'text',
    placeholder: 'Ej: Pandolfi',
    required: true,
  },
  {
    name: 'phone',
    label: 'Teléfono',
    type: 'text',
    placeholder: 'Ej: +58 412-000-0000',
    required: true,
  },
  {
    name: 'email',
    label: 'Correo',
    type: 'email',
    placeholder: 'Ej: example@gmail.com',
    required: false,
  },
  {
    name: 'address',
    label: 'Dirección',
    type: 'textarea',
    placeholder: 'Ej: Calle falsa 2324, edificio Dragon Stone, piso 4',
    required: false,
  },
]
