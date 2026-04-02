import { ExpenseModel } from '@/modules/expense/domain/models/expense.model'
import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ApartmentImageModel } from '@/modules/apartment/domain/models/apartment-image.model'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'

export class ApartmentModel {
  id: number
  floor: number
  number: string
  status: ApartmentStatusEnum
  images?: ApartmentImageModel[] | null
  bedrooms: number
  bathrooms: number
  expenses?: ExpenseModel[] | null
  updatedAt: Date
  createdAt: Date
  promotion?: PromotionModel | null
  deletedAt?: Date | null
  pricePerDay: number
  squareMeters?: number | null
  promotionId?: number | null
  reservations?: ReservationModel[] | null
}
