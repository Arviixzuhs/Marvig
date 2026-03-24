interface DateCellValueProps {
  value: string | Date | null | undefined
  format?: Intl.DateTimeFormatOptions
}

export const getFormattedDateTime = ({
  value,
  format = { day: '2-digit', month: '2-digit', year: 'numeric' },
}: DateCellValueProps) => {
  if (!value) return null

  let formatted = value
  try {
    const dateObj = typeof value === 'string' ? new Date(value) : value
    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
      formatted = dateObj.toLocaleDateString('es-AR', format)
    }
  } catch {
    formatted = value
  }

  return String(formatted)
}
