import { PromotionType } from '@/models/PromotionModel'
import { ModalInput, TableColumnInterface } from '@/features/appTableSlice'

export const tableColumns: TableColumnInterface[] = [
  {
    name: 'Nombre',
    uid: 'name',
  },
  {
    name: 'Tipo',
    uid: 'type',
    style: 'chip',
    chipConfig: {
      [PromotionType.FIXED]: { label: 'Fijo', color: '#3B82F6' },
      [PromotionType.PERCENTAGE]: { label: 'Porcentaje', color: '#10B981' },
    },
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
    name: 'type',
    label: 'Tipo de Promoción',
    type: 'select',
    placeholder: 'Selecciona el tipo',
    required: true,
    options: [
      { label: 'Monto Fijo', value: PromotionType.FIXED },
      { label: 'Porcentaje', value: PromotionType.PERCENTAGE },
    ],
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
    type: 'textarea',
    placeholder: 'Breve detalle de la promoción...',
    required: false,
  },
]
