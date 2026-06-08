import { IPromotionDto, PromotionType } from '@/models/PromotionModel'

interface CalcTotalByApartmentAndNightsProps {
  nights: number
  promotion?: IPromotionDto
  pricePerDay: number
}

export const calcTotalByApartmentAndNights = ({
  nights,
  promotion,
  pricePerDay,
}: CalcTotalByApartmentAndNightsProps): number => {
  let discountPerDay = 0

  if (promotion) {
    const promoValue = Number(promotion.value)

    if (promotion.type === PromotionType.PERCENTAGE) {
      discountPerDay = (pricePerDay * promoValue) / 100
    } else {
      discountPerDay = promoValue
    }
  }

  const finalPricePerDay = Math.max(0, pricePerDay - discountPerDay)

  const rawTotal = finalPricePerDay * nights

  return Math.round(rawTotal * 100) / 100 || 0
}
