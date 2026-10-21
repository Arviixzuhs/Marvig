import { SeasonType, AdjustmentUnit, PriceModifierType } from '@/models/SeasonModel'
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
      [SeasonType.LOW]: { label: 'Baja', color: '#3B82F6' },
      [SeasonType.MEDIUM]: { label: 'Media', color: '#10B981' },
      [SeasonType.HIGH]: { label: 'Alta', color: '#F59E0B' },
      [SeasonType.SPECIAL]: { label: 'Especial', color: '#8B5CF6' },
    },
  },
  {
    name: 'Valor',
    uid: 'value',
  },
  {
    name: 'Unidad',
    uid: 'unit',
    style: 'chip',
    chipConfig: {
      [AdjustmentUnit.PERCENTAGE]: { label: 'Porcentaje', color: '#635BFF' },
      [AdjustmentUnit.FIXED_AMOUNT]: { label: 'Monto Fijo', color: '#4B5563' },
    },
  },
  {
    name: 'Acción',
    uid: 'action',
    style: 'chip',
    chipConfig: {
      [PriceModifierType.INCREASE]: { label: 'Aumento', color: '#10B981' },
      [PriceModifierType.DECREASE]: { label: 'Descuento', color: '#EF4444' },
    },
  },
  {
    name: 'Fecha Inicio',
    uid: 'startDate',
    style: 'date',
  },
  {
    name: 'Fecha Fin',
    uid: 'endDate',
    style: 'date',
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
    placeholder: 'Ej: Temporada Vacacional',
    required: true,
  },
  {
    name: 'type',
    label: 'Tipo de Temporada',
    placeholder: 'Seleccione un tipo',
    type: 'select',
    required: true,
    options: [
      { label: 'Baja', value: SeasonType.LOW },
      { label: 'Media', value: SeasonType.MEDIUM },
      { label: 'Alta', value: SeasonType.HIGH },
      { label: 'Especial', value: SeasonType.SPECIAL },
    ],
  },
  {
    name: 'startDate',
    endName: 'endDate',
    label: 'Fechas de la Temporada',
    type: 'dateRange',
    required: true,
  },
  {
    name: 'value',
    label: 'Valor',
    type: 'float',
    placeholder: 'Ej: 15.00',
    required: true,
  },
  {
    name: 'unit',
    label: 'Unidad de Ajuste',
    placeholder: 'Seleccione una unidad',
    type: 'select',
    required: true,
    options: [
      { label: 'Porcentaje', value: AdjustmentUnit.PERCENTAGE },
      { label: 'Monto Fijo', value: AdjustmentUnit.FIXED_AMOUNT },
    ],
  },
  {
    name: 'action',
    label: 'Acción de Precio',
    placeholder: 'Seleccione una acción',
    type: 'select',
    required: true,
    options: [
      { label: 'Aumento', value: PriceModifierType.INCREASE },
      { label: 'Descuento', value: PriceModifierType.DECREASE },
    ],
  },
  /* {
    name: 'isActive',
    label: '¿Está activo?',
    type: 'boolean',
    required: false,
  }, */
  {
    name: 'description',
    label: 'Descripción',
    type: 'textarea',
    placeholder: 'Ej: Temporada con tarifas ajustadas para verano',
    required: false,
  },
]
