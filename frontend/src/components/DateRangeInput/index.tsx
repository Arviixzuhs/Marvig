import { DateRangePicker, type DateValue, type RangeValue } from '@heroui/react'
import { parseDate, CalendarDate } from '@internationalized/date'
import { I18nProvider } from '@react-aria/i18n'

interface DateRangeInputProps {
  label: string
  isRequired?: boolean
  startValue?: string | null
  endValue?: string | null
  onChange: (start: string | null, end: string | null) => void
}

const safeParseDate = (value?: string | null): CalendarDate | null => {
  if (!value) return null
  try {
    // Acepta "YYYY-MM-DD" y también ISO completo
    return parseDate(String(value).slice(0, 10))
  } catch {
    return null
  }
}

export const DateRangeInput = ({
  label,
  isRequired,
  startValue,
  endValue,
  onChange,
}: DateRangeInputProps) => {
  const start = safeParseDate(startValue)
  const end = safeParseDate(endValue)

  const handleChange = (value: RangeValue<DateValue> | null) => {
    if (!value || !value.start || !value.end) {
      onChange(null, null)
      return
    }
    onChange(value.start.toString().slice(0, 10), value.end.toString().slice(0, 10))
  }

  return (
    <I18nProvider locale='es'>
      <DateRangePicker
        label={label}
        isRequired={isRequired}
        validationBehavior='native'
        value={start && end ? { start, end } : null}
        onChange={handleChange}
        aria-label={label}
        className='w-full'
      />
    </I18nProvider>
  )
}
