export interface DateRangeInput {
  fromDate?: string
  toDate?: string
}

export const getDaysDifference = (from?: string, to?: string): number => {
  if (!from || !to) return 30
  const diff = new Date(to).getTime() - new Date(from).getTime()
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export const getPreviousPeriod = (fromDate: string, toDate: string): DateRangeInput => {
  const start = new Date(fromDate)
  const end = new Date(toDate)

  const diff = end.getTime() - start.getTime()

  return {
    fromDate: new Date(start.getTime() - diff).toISOString(),
    toDate: new Date(start.getTime()).toISOString(),
  }
}

export const getPercentageDiff = (curr: number, prev: number): string => {
  if (prev === 0) return curr > 0 ? '100' : '0'
  const diff = ((curr - prev) / Math.abs(prev)) * 100
  return Math.abs(diff).toFixed(1)
}
