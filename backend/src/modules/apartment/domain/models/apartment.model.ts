import { ApartmentStatus } from 'generated/prisma/enums'
import { ApartmentImageModel } from './apartment-image.model'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model' // Ajusta los paths
import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { Decimal } from '@prisma/client/runtime/client'
import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'

export class ApartmentModel {
  id: number
  floor: number
  number: string
  status: ApartmentStatus
  bedrooms: number
  bathrooms: number
  pricePerDay: Decimal
  promotion?: PromotionModel | null
  squareMeters?: number | null
  images?: ApartmentImageModel[] | null
  expenses?: ExpenseModel[] | null
  reservations?: ReservationModel[] | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  promotionId?: number | null
}
