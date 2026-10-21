import { DateValue } from '@internationalized/date'
export const toUtcMidnightISO = (value: DateValue) =>
  `${value.toString().slice(0, 10)}T00:00:00.000Z`
