export enum SeasonType {
  HIGH = 'HIGH_SEASON',
  LOW = 'LOW_SEASON',
}

export interface SeasonDate {
  month: number
  day: number
}

export interface Season {
  title: string
  type: SeasonType
  startDate: SeasonDate
  endDate: SeasonDate
  percentage: number
}

export const SEASON_CONFIGS: Season[] = [
  {
    title: 'Winter High Season',
    type: SeasonType.HIGH,
    startDate: { month: 12, day: 15 },
    endDate: { month: 1, day: 15 },
    percentage: 35,
  },
  {
    title: 'Summer High Season',
    type: SeasonType.HIGH,
    startDate: { month: 7, day: 1 },
    endDate: { month: 8, day: 31 },
    percentage: 20,
  },
  {
    title: 'Autumn Low Season',
    type: SeasonType.LOW,
    startDate: { month: 9, day: 1 },
    endDate: { month: 11, day: 30 },
    percentage: -15,
  },
]

const ONE_DAY_MS = 86400000
const REFERENCE_YEAR = 2001 // Año no bisiesto

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  return Math.floor((current.getTime() - start.getTime()) / ONE_DAY_MS)
}

function seasonDateToDayOfYear(date: SeasonDate): number {
  return getDayOfYear(new Date(REFERENCE_YEAR, date.month - 1, date.day))
}

const PREPARED_SEASONS = SEASON_CONFIGS.map((season) => {
  const start = seasonDateToDayOfYear(season.startDate)
  const end = seasonDateToDayOfYear(season.endDate)

  return {
    season,
    start,
    end,
    crossesYear: start > end,
  }
})

function getOverlapDays(
  rangeStart: number,
  rangeEnd: number,
  seasonStart: number,
  seasonEnd: number,
): number {
  const overlapStart = Math.max(rangeStart, seasonStart)
  const overlapEnd = Math.min(rangeEnd, seasonEnd)

  return overlapStart < overlapEnd ? overlapEnd - overlapStart : 0
}

export function getSeasonByDateRange(startDate: Date, endDate: Date): Season | null {
  const startDay = getDayOfYear(startDate)
  const endDay = getDayOfYear(endDate)

  if (startDate >= endDate || PREPARED_SEASONS.length === 0) {
    return null
  }

  let predominantSeason: Season | null = null
  let maxDays = 0

  const rangeLength =
    Math.floor(
      (new Date(startDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime() -
        new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime()) /
        ONE_DAY_MS,
    ) || endDay - startDay

  for (const season of PREPARED_SEASONS) {
    let days = 0

    if (season.crossesYear) {
      // Parte 1: desde inicio de temporada hasta fin de año
      days += getOverlapDays(startDay, endDay, season.start, 366)

      // Parte 2: desde inicio del año hasta fin de temporada
      days += getOverlapDays(startDay, endDay, 1, season.end + 1)
    } else {
      days = getOverlapDays(startDay, endDay, season.start, season.end + 1)
    }

    if (days === rangeLength) {
      return season.season
    }

    if (days > maxDays) {
      maxDays = days
      predominantSeason = season.season
    }
  }

  return predominantSeason
}
