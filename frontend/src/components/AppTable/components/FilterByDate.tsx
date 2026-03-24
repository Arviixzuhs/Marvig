import React from 'react'
import { useLocation } from 'react-router-dom'
import { setDateFilter, setDateFilterPeriod } from '@/features/appTableSlice'
import { RootState } from '@/store'
import { Calendar, Trash } from 'lucide-react'
import { parseDate, CalendarDate } from '@internationalized/date'
import { useDispatch, useSelector } from 'react-redux'
import {
  Modal,
  Badge,
  Button,
  Tooltip,
  ModalBody, 
  ModalHeader,
  ModalFooter, 
  ModalContent,
  useDisclosure,
  DateRangePicker, 
  type DateValue,
  type RangeValue,
} from '@heroui/react'
import { DateFilterPeriodButtons } from './DateFilterPeriodButtons'

export const FilterByDatePicker = () => {
  const dispatch = useDispatch()
  const table = useSelector((state: RootState) => state.appTable)
  const location = useLocation()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

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

  const isFilterActive = table.dateFilter.start !== '' && table.dateFilter.end !== ''

  const getDateValue = (): RangeValue<CalendarDate> | null => {
    if (table.dateFilter.start && table.dateFilter.end) {
      return {
        start: parseDate(table.dateFilter.start),
        end: parseDate(table.dateFilter.end),
      }
    }
    return null
  }

  const TooltipContent = () => {
    return (
      <div>
        {isFilterActive ? (
          <div>
            Filtrar desde <span className='text-primary'>{table.dateFilter.start}</span> hasta{' '}
            <span className='text-primary'>{table.dateFilter.end}</span>
          </div>
        ) : (
          <span>Filtrar por fecha</span>
        )}
      </div>
    )
  }

  return (
    <>
      <Badge
        content=''
        color='primary'
        shape='circle'
        placement='bottom-right'
        isInvisible={!isFilterActive}
      >
        <Tooltip content={<TooltipContent />}>
          <Button
            onPress={onOpen}
            isIconOnly
            radius='sm'
            className='bg-c-filter text-c-filter-text'
          >
            <Calendar
              size={18}
              className='text-xl text-default-500 pointer-events-none flex-shrink-0'
            />
          </Button>
        </Tooltip>
      </Badge>
      <Modal isOpen={isOpen} placement='center' onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1 default-text-color'>
            Filtrar por fecha
          </ModalHeader>
          <ModalBody>
            <div className='flex flex-col gap-4'>
              <div className='flex gap-2'>
                <div className='w-full'>
                  <DateRangePicker
                    radius='sm'
                    value={getDateValue()}
                    onChange={handleChangeDate}
                    aria-label='Fecha'
                  />
                </div>
                <Button onPress={clearFilter} isIconOnly variant='flat' radius='sm'>
                  <Trash
                    size={18}
                    className='text-xl text-default-500 pointer-events-none flex-shrink-0'
                  />
                </Button>
              </div>
              <DateFilterPeriodButtons />
            </div>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  )
}
