import { DateValue } from '@heroui/react'
import { DateFormatter } from '@internationalized/date'

export const formatCalendarDate = (date: DateValue): string => {
  const formatter = new DateFormatter('es-ES', { dateStyle: 'short' })

  return formatter.format(date.toDate(Intl.DateTimeFormat().resolvedOptions().timeZone))
}
