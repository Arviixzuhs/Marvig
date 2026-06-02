import React from 'react'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { I18nProvider } from '@react-aria/i18n'
import { formatCurrency } from '@/utils/formatCurrency'
import { apartmentService } from '@/services/apartment'
import { reservationService } from '@/services/reservation'
import { Divider, RangeCalendar } from '@heroui/react'
import { calculateReservationTotal } from '@/utils/calcTotalByApartmentAndDates'
import { Autocomplete, AutocompleteChip } from '@/components/Autocomplete'
import { CalendarDate, DateValue, getLocalTimeZone, today } from '@internationalized/date'

interface IEstimationWithCalendarProps {
  value: { start: DateValue; end: DateValue } | null
  setValue: (value: { start: DateValue; end: DateValue } | null) => void
  totalCalculated: number
  setTotalCalculated: React.Dispatch<React.SetStateAction<number>>
}

export const EstimationWithCalendar = ({
  value,
  setValue,
  totalCalculated,
  setTotalCalculated,
}: IEstimationWithCalendarProps) => {
  const table = useSelector((state: RootState) => state.appTable)

  const [invalidDates, setInvalidDates] = React.useState<CalendarDate[]>([])

  const selectedApartments = table.formData?.apartments as AutocompleteChip[]
  React.useEffect(() => {
    console.log(selectedApartments)
    const loadData = async () => {
      try {
        const response = await reservationService.getInvalidDates(
          selectedApartments.map((a) => a.id),
        )
        if (!response) return
        console.log(selectedApartments.map((a) => a.id))

        const formattedDates = response.map(
          (d) => new CalendarDate(parseInt(d.year), parseInt(d.month), parseInt(d.day)),
        )

        setInvalidDates(formattedDates)
      } catch (error) {
        console.error('Error cargando fechas no disponibles:', error)
      }
    }

    loadData()
  }, [selectedApartments])
  const handleCalculateTotal = async () => {
    if (!selectedApartments?.length) {
      setTotalCalculated(0)
      return
    }

    try {
      const response = await apartmentService.getAll({
        search: '',
        page: 0,
        pageSize: 50,
        ids: selectedApartments.map((a) => a.id),
      })

      if (response?.content) {
        const total = calculateReservationTotal(
          new Date(String(value?.start)),
          new Date(String(value?.end)),
          response.content,
        )
        setTotalCalculated(total)
      }
    } catch (error) {
      console.error('Error calculating total:', error)
    }
  }

  React.useEffect(() => {
    handleCalculateTotal()
  }, [value?.start, value?.end, selectedApartments])

  const isDateUnavailable = (date: DateValue) => {
    if (date.compare(today(getLocalTimeZone())) < 0) return true
    if (selectedApartments?.length === 0) return false

    return invalidDates.some((invalidDate) => date.compare(invalidDate) === 0)
  }

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <span className='text-sm font-medium text-muted-foreground'>
            Estimación de la reserva
          </span>
          <Divider />
        </div>
        <div className='flex gap-4'>
          <div>
            <I18nProvider locale='es'>
              <RangeCalendar
                value={value}
                aria-label='Date (Controlled)'
                onChange={setValue}
                errorMessage='Selecciona una fecha disponible'
                isDateUnavailable={isDateUnavailable}
                classNames={{
                  base: 'shadow-none ',
                }}
              />
            </I18nProvider>
          </div>
          <div className='flex flex-col gap-4 w-full'>
            <Autocomplete
              chips
              label='Apartamentos'
              formDataKey='apartments'
              placeholder='Buscar apartamentos...'
              fetchItems={async (search) => {
                const res = await apartmentService.getAll({
                  search,
                  page: 0,
                  pageSize: 10,
                })
                return (
                  res?.content.map((item) => ({
                    id: item.id,
                    name: `Apto. ${item.number} - $${item.pricePerDay}/noche`,
                  })) || []
                )
              }}
            />
            {table.currentItemToUpdate === -1 && (
              <div className='flex flex-col gap-4'>
                <div className='p-4 bg-primary-50 rounded-lg border border-primary-100'>
                  <h3 className='text-lg font-semibold text-primary-700'>
                    Total Estimado:{' '}
                    <span className='text-xl'>{formatCurrency(totalCalculated)}</span>
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
