import { SeasonModel } from '@/modules/season/domain/models/season.model'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { AdjustmentUnit } from '@/modules/season/domain/enums/adjustment-unit.enum'
import { PromotionTypeEnum } from '@/modules/promotion/domain/enums/promotion-type.enum'
import { PriceModifierType } from '@/modules/season/domain/enums/price-modifier-type.enum'

interface ICalcTotalByApartmentsAndDatesProps {
  endDate: Date
  startDate: Date
  apartments: ApartmentModel[]
  /** Temporadas activas que se solapan con la reserva (globales o de estos apartamentos) */
  seasons?: SeasonModel[]
}

/** Clave de día "YYYY-MM-DD" en UTC (las temporadas se guardan a medianoche UTC) */
const toDayKey = (date: Date | string): string => new Date(date).toISOString().slice(0, 10)

/** Noches de la estancia: desde el día de entrada hasta el día ANTERIOR a la salida */
const getNightKeys = (startDate: Date, endDate: Date): string[] => {
  const keys: string[] = []
  const endKey = toDayKey(endDate)
  const cursor = new Date(
    Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()),
  )

  while (toDayKey(cursor) < endKey) {
    keys.push(toDayKey(cursor))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return keys
}

/**
 * Temporada que aplica a un apartamento en una noche (extremos incluidos).
 * La validación al crear temporadas evita solapes, pero por seguridad, si hubiera
 * más de una gana la específica del apartamento y, luego, la que empezó más tarde.
 */
const findSeasonForNight = (
  seasons: SeasonModel[],
  apartmentId: number,
  nightKey: string,
): SeasonModel | undefined => {
  const matches = seasons.filter(
    (season) =>
      toDayKey(season.startDate) <= nightKey &&
      nightKey <= toDayKey(season.endDate) &&
      (season.apartmentIds.length === 0 || season.apartmentIds.includes(apartmentId)),
  )

  return matches.sort(
    (a, b) =>
      Number(b.apartmentIds.length > 0) - Number(a.apartmentIds.length > 0) ||
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  )[0]
}

const applySeason = (price: number, season: SeasonModel): number => {
  const value = Number(season.value)
  const delta = season.unit === AdjustmentUnit.PERCENTAGE ? (price * value) / 100 : value

  return Math.max(0, season.action === PriceModifierType.INCREASE ? price + delta : price - delta)
}

const applyPromotion = (price: number, promotion: ApartmentModel['promotion']): number => {
  if (!promotion) return price

  const promotionValue = Number(promotion.value)

  return promotion.type === PromotionTypeEnum.PERCENTAGE
    ? price - (price * promotionValue) / 100
    : price - promotionValue
}

export const calcTotalByApartmentsAndDates = ({
  startDate,
  endDate,
  apartments,
  seasons = [],
}: ICalcTotalByApartmentsAndDatesProps): number => {
  const nightKeys = getNightKeys(startDate, endDate)

  if (nightKeys.length === 0) return 0

  const total = apartments.reduce((sum, apartment) => {
    const basePrice = Number(apartment.pricePerDay)

    const apartmentTotal = nightKeys.reduce((nightsSum, nightKey) => {
      const season = findSeasonForNight(seasons, apartment.id, nightKey)

      const seasonalPrice = season ? applySeason(basePrice, season) : basePrice
      const finalPrice = Math.max(0, applyPromotion(seasonalPrice, apartment.promotion))

      return nightsSum + finalPrice
    }, 0)

    return sum + apartmentTotal
  }, 0)

  return Math.round(total * 100) / 100 || 0
}
