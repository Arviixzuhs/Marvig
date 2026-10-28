import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { DateValue, RangeValue } from '@heroui/react'
import { getLocalTimeZone } from '@internationalized/date'
import { useLocation } from 'react-router-dom'

interface CalendarContextType {
  date: RangeValue<DateValue> | null | undefined
  nights: number
  setDate: React.Dispatch<React.SetStateAction<RangeValue<DateValue> | null | undefined>>
  refresh: boolean
  refreshCalendar: () => void
  clearCalendar: () => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation()
  const [date, setDate] = useState<RangeValue<DateValue> | null | undefined>(null)
  const [refresh, setRefress] = useState<boolean>(false)
  const [nights, setNights] = useState<number>(0)

  const startMs = date?.start.toDate(getLocalTimeZone()).getTime() ?? 0
  const endMs = date?.end.toDate(getLocalTimeZone()).getTime() ?? 0
  const totalDays = date ? Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) : 0

  React.useEffect(() => {
    setNights(totalDays)
  }, [totalDays])

  const clearCalendar = useCallback(() => {
    setDate(null)
    setNights(0)
  }, [])

  React.useEffect(() => {
    if (/apartment|checkout/.test(location.pathname)) return
    return () => {
      clearCalendar()
    }
  }, [location.pathname, clearCalendar])

  const refreshCalendar = () => {
    setRefress(!refresh)
  }

  return (
    <CalendarContext.Provider
      value={{ date, nights, setDate, refreshCalendar, refresh, clearCalendar }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export const useCalendarContext = () => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendarContext debe ser usado dentro de un CalendarProvider')
  }
  return context
}
