import { getDiffDays } from './get-diff-days-by-dates.util'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { PromotionTypeEnum } from '@/modules/promotion/domain/enums/promotion-type.enum'

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

  const rawTotal = apartments.reduce((acc, apartment) => {
    const pricePerDay = Number(apartment.pricePerDay)
    let discount = 0

    if (apartment.promotion) {
      const promoValue = Number(apartment.promotion.value)

      if (apartment.promotion.type === PromotionTypeEnum.PERCENTAGE) {
        discount = (pricePerDay * promoValue) / 100
      } else {
        discount = promoValue
      }
    }

    const finalPricePerDay = Math.max(0, pricePerDay - discount)
    return acc + finalPricePerDay * diffDays
  }, 0)

  return Math.round(rawTotal * 100) / 100 || 0
}
