import React from 'react'
import { RootState } from '@/store'
import { useLocation } from 'react-router-dom'
import { useIsMobile } from '@/hooks/useMobile'
import { I18nProvider } from '@react-aria/i18n'
import { Calendar, Trash } from 'lucide-react'
import { CalendarDate, parseDate } from '@internationalized/date'
import { DateFilterPeriodButtons } from './DateFilterPeriodButtons'
import { useDispatch, useSelector } from 'react-redux'
import { setDateFilter, setDateFilterPeriod } from '@/features/appTableSlice'
import {
  Button,
  Popover,
  DateRangePicker,
  PopoverContent,
  PopoverTrigger,
  type DateValue,
  type RangeValue,
} from '@heroui/react'

export const FilterByDatePicker = () => {
  const dispatch = useDispatch()
  const table = useSelector((state: RootState) => state.appTable)
  const location = useLocation()
  const isMobile = useIsMobile()

  React.useEffect(() => {
    clearFilter()
  }, [location])

  const handleChangeDate = (e: RangeValue<DateValue> | null) => {
    if (!e) return
    dispatch(
      setDateFilterPeriod({
        period: null,
      }),
    )

    dispatch(
      setDateFilter({
        start: e.start?.toString() || '',
        end: e.end?.toString() || '',
      }),
    )
  }

  const clearFilter = () => {
    dispatch(
      setDateFilterPeriod({
        period: null,
      }),
    )

    dispatch(
      setDateFilter({
        end: '',
        start: '',
      }),
    )
  }

  const getDateValue = (): RangeValue<CalendarDate> | null => {
    if (table.dateFilter.start && table.dateFilter.end) {
      return {
        start: parseDate(table.dateFilter.start),
        end: parseDate(table.dateFilter.end),
      }
    }
    return null
  }

  return (
    <div>
      <Popover placement='bottom-start'>
        <PopoverTrigger>
          <Button
            radius='lg'
            variant='flat'
            isIconOnly={isMobile}
            startContent={<Calendar size={18} className='text-xl text-default-500' />}
          >
            {!isMobile ? 'Filtrar fechas' : ''}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0'>
          <div className='flex flex-col gap-4 p-4 border border-default-100 rounded-xl bg-content1 shadow-md'>
            <span className='text-xs font-semibold text-default-500 tracking-wider'>
              Filtrar por fecha
            </span>
            <div className='flex flex-col gap-4'>
              <div className='flex gap-2 items-center'>
                <div className='w-full'>
                  <I18nProvider locale='es'>
                    <DateRangePicker
                      radius='sm'
                      value={getDateValue()}
                      onChange={handleChangeDate}
                      aria-label='Fecha'
                    />
                  </I18nProvider>
                </div>
                <Button
                  onPress={clearFilter}
                  isIconOnly
                  variant='flat'
                  radius='sm'
                  className='shrink-0'
                >
                  <Trash
                    size={18}
                    className='text-xl text-default-500 pointer-events-none flex-shrink-0'
                  />
                </Button>
              </div>
              <DateFilterPeriodButtons />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
