import { getDiffDays } from './get-diff-days-by-dates.util'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { PromotionTypeEnum } from '@/modules/promotion/domain/enums/promotion-type.enum'
import { getSeasonByDateRange } from './get-season.util'

interface ICalcTotalByApartmentsAndDatesProps {
  endDate: Date
  startDate: Date
  apartments: ApartmentModel[]
}

export const calcTotalByApartments = ({
  startDate,
  endDate,
  apartments,
}: ICalcTotalByApartmentsAndDatesProps): number => {
  const diffDays = getDiffDays(startDate, endDate)

  if (diffDays <= 0) return 0

  const seasonPercentage = getSeasonByDateRange(startDate, endDate)?.percentage ?? 0

  const total = apartments.reduce((sum, apartment) => {
    const basePrice = Number(apartment.pricePerDay)
    const seasonalPrice = basePrice * (1 + seasonPercentage / 100)

    let finalPrice = seasonalPrice

    const promotion = apartment.promotion
    if (promotion) {
      const promotionValue = Number(promotion.value)

      if (promotion.type === PromotionTypeEnum.PERCENTAGE) {
        finalPrice -= (seasonalPrice * promotionValue) / 100
      } else {
        finalPrice -= promotionValue
      }
    }

    return sum + Math.max(0, finalPrice) * diffDays
  }, 0)

  return Math.round(total * 100) / 100 || 0
}
