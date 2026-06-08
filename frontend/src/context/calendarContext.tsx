import React, { createContext, useContext, useState, ReactNode } from 'react'
import { DateValue, RangeValue } from '@heroui/react'

interface CalendarContextType {
  date: RangeValue<DateValue> | null | undefined
  setDate: React.Dispatch<React.SetStateAction<RangeValue<DateValue> | null | undefined>>
  refresh: boolean
  refreshCalendar: () => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [date, setDate] = useState<RangeValue<DateValue> | null | undefined>(null)
  const [refresh, setRefress] = useState<boolean>(false)

  const refreshCalendar = () => {
    setRefress(!refresh)
  }

  return (
    <CalendarContext.Provider value={{ date, setDate, refreshCalendar, refresh }}>
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
