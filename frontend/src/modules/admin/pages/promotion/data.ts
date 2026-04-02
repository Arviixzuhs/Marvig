import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'Nombre',
    uid: 'name',
  },
  {
    name: 'Tipo',
    uid: 'type',
  },
  {
    name: 'Valor',
    uid: 'value',
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
    name: 'name',
    label: 'Nombre de la Promoción',
    type: 'text',
    placeholder: 'Ej: Descuento de Verano',
    required: true,
  },
  {
    name: 'value',
    label: 'Valor',
    type: 'number',
    placeholder: '0.00',
    required: true,
  },
  {
    name: 'description',
    label: 'Descripción',
    type: 'text',
    placeholder: 'Breve detalle de la promoción...',
    required: false,
  },
]
