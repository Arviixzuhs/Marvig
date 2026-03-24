import React from 'react'
import { Button } from '@heroui/button'
import { RootState } from '@/store'
import { CalendarDate } from '@internationalized/date'
import { useDispatch, useSelector } from 'react-redux'
import { setDateFilter, DateFilterPeriod, setDateFilterPeriod } from '@/features/appTableSlice'

export const DateFilterPeriodButtons = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const dateFilterPeriod = table.dateFilterPeriod
  const dispatch = useDispatch()

  React.useEffect(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1

    let start: CalendarDate
    let end: CalendarDate

    if (!dateFilterPeriod) return

    switch (dateFilterPeriod) {
      case DateFilterPeriod.TODAY:
        start = end = new CalendarDate(year, month, today.getDate())
        break
      case DateFilterPeriod.MONTHLY:
        start = new CalendarDate(year, month, 1)
        end = new CalendarDate(year, month, new Date(year, month, 0).getDate())
        break
      case DateFilterPeriod.LAST_MONTH:
        const lastMonthDate = new Date(year, month - 1, 0)
        const lmYear = lastMonthDate.getFullYear()
        const lmMonth = lastMonthDate.getMonth() + 1
        start = new CalendarDate(lmYear, lmMonth, 1)
        end = new CalendarDate(lmYear, lmMonth, lastMonthDate.getDate())
        break
      case DateFilterPeriod.YEARLY:
        start = new CalendarDate(year, 1, 1)
        end = new CalendarDate(year, 12, 31)
        break
      default:
        return
    }

    dispatch(
      setDateFilter({
        start: String(start),
        end: String(end),
      }),
    )
  }, [dateFilterPeriod])

  const reportTypeButtons = [
    {
      name: 'Año actual',
      value: DateFilterPeriod.YEARLY,
    },
    {
      name: 'Mes actual',
      value: DateFilterPeriod.MONTHLY,
    },
    {
      name: 'Mes pasado',
      value: DateFilterPeriod.LAST_MONTH,
    },
    {
      name: 'Hoy',
      value: DateFilterPeriod.TODAY,
    },
  ]

  return (
    <div className='flex gap-2'>
      {reportTypeButtons.map((ele, ind) => (
        <Button
          key={ind}
          size='sm'
          variant={ele.value == dateFilterPeriod ? 'solid' : 'flat'}
          color={ele.value == dateFilterPeriod ? 'primary' : 'default'}
          onPress={() =>
            dispatch(
              setDateFilterPeriod({
                period: ele.value,
              }),
            )
          }
        >
          {ele.name}
        </Button>
      ))}
    </div>
  )
}
