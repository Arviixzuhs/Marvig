import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'Monto',
    uid: 'amount',
  },
  {
    name: 'Descripción',
    uid: 'description',
  },
  {
    name: 'Acciones',
    uid: 'actions',
  },
]

export const modalInputs: ModalInput[] = [
  {
    name: 'amount',
    label: 'Monto',
    type: 'number',
    placeholder: '0.00',
    required: true,
  },
  {
    name: 'description',
    label: 'Descripción',
    type: 'text',
    placeholder: 'Motivo del gasto...',
    required: false,
  },
]
