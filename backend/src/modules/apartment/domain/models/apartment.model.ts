import { Decimal } from '@prisma/client/runtime/client'
import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'
import { ApartmentStatus } from 'generated/prisma/enums'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ApartmentImageModel } from './apartment-image.model'

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
