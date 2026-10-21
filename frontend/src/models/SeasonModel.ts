export enum SeasonType {
  LOW = 'LOW',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  SPECIAL = 'SPECIAL',
}

export enum AdjustmentUnit {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export enum PriceModifierType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

export interface SeasonModel {
  id: number
  name: string
  description: string | null
  startDate: string
  endDate: string
  value: number
  unit: AdjustmentUnit
  action: PriceModifierType
  type: SeasonType
  isActive: boolean
  apartmentIds: number[]
  createdAt: string
  updatedAt: string
}

export interface ISeasonFilter {
  name?: string
  types?: SeasonType[]
  units?: AdjustmentUnit[]
  actions?: PriceModifierType[]
  isActive?: boolean
  apartmentId?: number
  fromDate?: string
  toDate?: string
  page?: number
  pageSize?: number
  isUnpaged?: boolean
}

export interface ICreateSeasonPayload {
  name: string
  description?: string
  startDate: string
  endDate: string
  value: number
  unit?: AdjustmentUnit
  action?: PriceModifierType
  type?: SeasonType
  isActive?: boolean
  apartmentIds?: number[]
}

export type IUpdateSeasonPayload = Partial<ICreateSeasonPayload>
