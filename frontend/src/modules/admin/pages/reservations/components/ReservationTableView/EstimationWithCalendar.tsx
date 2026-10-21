import React from 'react'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { I18nProvider } from '@react-aria/i18n'
import { formatCurrency } from '@/utils/formatCurrency'
import { ApartmentStatus } from '@/models/ApartmentModel'
import { DifferenceCard } from './DifferenceCard'
import { apartmentService } from '@/services/apartment'
import { GET_INVALID_DATES } from '@/services/reservation/graphql/getInvalidDatesQuery'
import { toUtcMidnightISO } from '@/utils/toUtcMidnightISO'
import { ApartmentMiniCard } from '@/components/ApartmentMiniCard'
import { useCalendarContext } from '@/context/calendarContext'
import { Divider, RangeCalendar } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearFormData, setFormData } from '@/features/appTableSlice'
import { CALCULATE_RESERVATION_TOTAL } from '@/services/reservation/graphql/calculateReservationTotalQuery'
import { InvalidDate, ReservationModel } from '@/models/ReservationModel'
import { Autocomplete, AutocompleteChip } from '@/components/Autocomplete'
import { ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react'
import {
  today,
  DateValue,
  parseDate,
  CalendarDate,
  getLocalTimeZone,
} from '@internationalized/date'

interface IEstimationWithCalendarProps {
  setTotalCalculated: React.Dispatch<React.SetStateAction<number>>
  currentReservationEdit?: ReservationModel
}

export const EstimationWithCalendar = ({
  setTotalCalculated,
  currentReservationEdit,
}: IEstimationWithCalendarProps) => {
  const table = useSelector((state: RootState) => state.appTable)
  const { date, setDate } = useCalendarContext()
  const dispatch = useDispatch()
  const selectedApartments = (table.formData?.apartments || []) as AutocompleteChip[]
  const [focusedDate, setFocusedDate] = React.useState<DateValue | undefined>(
    date?.start ?? undefined,
  )

  const { data: invalidDatesRes } = useQuery<{ getInvalidDates: InvalidDate[] }>(
    GET_INVALID_DATES,
    {
      variables: {
        apartmentIds: selectedApartments.map((a) => a.id),
        reserveIdToExclude:
          table.currentItemToUpdate === -1 ? undefined : table.currentItemToUpdate,
      },
      fetchPolicy: 'network-only',
      skip: !selectedApartments || selectedApartments.length === 0,
    },
  )

  const invalidDates =
    invalidDatesRes?.getInvalidDates?.map(
      (d) => new CalendarDate(parseInt(d.year), parseInt(d.month), parseInt(d.day)),
    ) || []

  // El total lo calcula el backend (precio base + temporada + promoción),
  // con la misma lógica que valida al crear la reserva.
  const isRangeReady =
    selectedApartments.length > 0 &&
    !!date?.start &&
    !!date?.end &&
    date.end.compare(date.start) > 0

  const {
    data: totalRes,
    previousData: previousTotalRes,
    loading: isCalculatingTotal,
  } = useQuery<{ calculateReservationTotal: number }>(CALCULATE_RESERVATION_TOTAL, {
    variables: {
      data: {
        apartmentIds: selectedApartments.map((a) => Number(a.id)),
        startDate: date?.start ? toUtcMidnightISO(date.start) : undefined,
        endDate: date?.end ? toUtcMidnightISO(date.end) : undefined,
      },
    },
    skip: !isRangeReady,
    fetchPolicy: 'network-only',
  })

  // Mientras recalcula se mantiene el último valor para que no parpadee en 0
  const total = isRangeReady
    ? (totalRes ?? previousTotalRes)?.calculateReservationTotal ?? 0
    : 0

  React.useEffect(() => {
    setDate(null)
    setFocusedDate(undefined)
    dispatch(clearFormData(null))
  }, [table.isAddItemModalOpen, table.isEditItemModalOpen])

  React.useEffect(() => {
    setTotalCalculated(total)
  }, [total])

  React.useEffect(() => {
    if (!currentReservationEdit || !currentReservationEdit.apartments) return

    const start = parseDate(currentReservationEdit.startDate.toString().split('T')[0])
    setFocusedDate(start)

    setDate({
      start,
      end: parseDate(currentReservationEdit.endDate.toString().split('T')[0]),
    })

    dispatch(
      setFormData({
        name: 'apartments',
        value:
          currentReservationEdit.apartments.map((item) => ({
            id: item.id,
            label: `Apto. ${item.number} - $${item.pricePerDay}/noche`,
          })) || [],
      }),
    )
  }, [table.currentItemToUpdate])

  const isDateUnavailable = (date: DateValue) => {
    if (date.compare(today(getLocalTimeZone())) < 0) return true
    if (selectedApartments?.length === 0) return false
    return invalidDates.some((invalidDate) => date.compare(invalidDate) === 0)
  }

  const renderDifferenceCard = () => {
    if (table.currentItemToUpdate === -1 || !currentReservationEdit) return null

    const difference = total - currentReservationEdit.totalPrice

    if (difference > 0) {
      return (
        <DifferenceCard
          icon={ShieldAlert}
          title='Diferencia: Faltante'
          description={`Monto a pagar: ${formatCurrency(difference)}`}
          bgColor='bg-amber-50 dark:bg-[#251f15]'
          borderColor='border-amber-200 dark:border-[#42331c]'
          textColor='text-amber-800 dark:text-[#fcd34d]'
        />
      )
    }

    if (difference < 0) {
      return (
        <DifferenceCard
          icon={CheckCircle2}
          title='Diferencia: Sobrante'
          description={`Saldo a favor: ${formatCurrency(Math.abs(difference))}`}
          bgColor='bg-emerald-50 dark:bg-[#14221a]'
          borderColor='border-emerald-200 dark:border-[#1e3d2b]'
          textColor='text-emerald-800 dark:text-[#6ee7b7]'
        />
      )
    }

    return (
      <DifferenceCard
        icon={RefreshCw}
        title='Sin diferencia'
        description='El cambio de fechas no altera el costo original de la reserva.'
        bgColor='bg-neutral-50 dark:bg-content2'
        borderColor='border-neutral-200 dark:border-[#252128]'
        textColor='text-neutral-600 dark:text-muted-foreground'
      />
    )
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
                value={date}
                onChange={setDate}
                aria-label='Date (Controlled)'
                errorMessage='Selecciona una fecha disponible'
                focusedValue={focusedDate}
                onFocusChange={setFocusedDate}
                isDateUnavailable={isDateUnavailable}
                classNames={{
                  base: 'shadow-none',
                }}
              />
            </I18nProvider>
          </div>
          <div className='flex flex-col gap-4 w-full'>
            {currentReservationEdit && currentReservationEdit.apartments && (
              <>
                {currentReservationEdit.apartments.map((item) => (
                  <ApartmentMiniCard key={item.id} apartment={item} />
                ))}
              </>
            )}
            {table.isAddItemModalOpen && (
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
                    status: [
                      ApartmentStatus.AVAILABLE,
                      ApartmentStatus.OCCUPIED,
                      ApartmentStatus.RESERVED,
                    ],
                  })
                  return (
                    res?.content.map((item) => ({
                      id: item.id,
                      name: `Apto. ${item.number} - $${item.pricePerDay}/noche`,
                    })) || []
                  )
                }}
              />
            )}
            <div className='flex flex-col gap-4'>
              <div className='p-4 bg-primary-50 rounded-lg border border-primary-100'>
                <h3 className='text-lg font-semibold text-primary-700'>
                  Total Estimado:{' '}
                  <span className='text-xl'>
                    {isCalculatingTotal && !previousTotalRes ? 'Calculando...' : formatCurrency(total)}
                  </span>
                </h3>
              </div>
            </div>
            {renderDifferenceCard()}
          </div>
        </div>
      </div>
    </>
  )
}
