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
]
