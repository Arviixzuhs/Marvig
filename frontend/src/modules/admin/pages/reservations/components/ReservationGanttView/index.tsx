import React from 'react'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { EmptyContent } from '@/components/AppTable/components/EmptyContent'
import { IPageResponse } from '@/api/interfaces'
import { GET_RESERVATIONS } from '@/services/reservation/graphql/getReservationsQuery'
import { Button, ButtonGroup } from '@heroui/react'
import { ReservationDetailModal } from '@/modules/admin/pages/reservations/components/ReservationDetailModal'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronLeft, ChevronRight, User } from 'lucide-react'
import { ReservationModel, ReservationStatus } from '@/models/ReservationModel'
import { setCurrentItemToView, toggleViewItemModal } from '@/features/appTableSlice'

const statusColorMap: Record<
  ReservationStatus,
  { bg: string; border: string; text: string; label: string }
> = {
  [ReservationStatus.PENDING]: {
    bg: 'bg-amber-200',
    border: 'border-amber-400',
    text: 'text-amber-900',
    label: 'Pendiente',
  },
  [ReservationStatus.CONFIRMED]: {
    bg: 'bg-emerald-200',
    border: 'border-emerald-400',
    text: 'text-emerald-900',
    label: 'Confirmado',
  },
  [ReservationStatus.CANCELLED]: {
    bg: 'bg-rose-200',
    border: 'border-rose-400',
    text: 'text-rose-900',
    label: 'Cancelado',
  },
  [ReservationStatus.COMPLETED]: {
    bg: 'bg-neutral-200',
    border: 'border-neutral-400',
    text: 'text-neutral-700',
    label: 'Completado',
  },
}

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const formatDateToISOString = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const ReservationGanttView = () => {
  const dispatch = useDispatch()
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const table = useSelector((state: RootState) => state.appTable)
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month, daysInMonth)

  const queryStartDate = formatDateToISOString(firstDayOfMonth)
  const queryEndDate = formatDateToISOString(lastDayOfMonth)

  const { data } = useQuery<{
    findReservations: IPageResponse<ReservationModel>
  }>(GET_RESERVATIONS, {
    variables: {
      filters: {
        page: 0,
        pageSize: 200,
        startDate: queryStartDate,
        endDate: queryEndDate,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  const reservations = data?.findReservations.content || []

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getDay = (date: string) => {
    const d = new Date(date)
    return d.getUTCDate()
  }

  const openModal = (id: number) => {
    console.log(id)
    dispatch(setCurrentItemToView(id))
    dispatch(toggleViewItemModal(null))
  }

  const currentReservationView = data?.findReservations.content.find(
    (item) => item.id === table.currentItemToView,
  )

  return (
    <>
      <div className='bg-white rounded-xl p-4 sm:p-6 w-full max-w-full h-full flex flex-col min-h-0 border border-neutral-100 shadow-sm'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 pb-4 mb-4 shrink-0'>
          <div className='flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start'>
            <div className='flex bg-neutral-100 rounded-lg p-0.5'>
              <ButtonGroup size='sm'>
                <Button variant='flat' isIconOnly size='sm' onPress={prevMonth}>
                  <ChevronLeft size={16} />
                </Button>
                <Button variant='flat' isIconOnly size='sm' onPress={nextMonth}>
                  <ChevronRight size={16} />
                </Button>
              </ButtonGroup>
            </div>
            <h2 className='font-bold text-lg sm:text-xl capitalize whitespace-nowrap text-neutral-800'>
              {MONTHS[month]} {year}
            </h2>
          </div>
          <div className='flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-600'>
            {Object.values(statusColorMap).map((item) => (
              <div key={item.label} className='flex items-center gap-1.5 whitespace-nowrap'>
                <span className={`w-3 h-3 rounded-full ${item.bg} ${item.border} border`} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
        {reservations.length === 0 && <EmptyContent />}
        {reservations.length > 0 && (
          <div className='flex-1 min-h-0 overflow-x-auto hoverScrollbar overflow-y-auto border border-neutral-200 rounded-lg scrollbar-thin select-none'>
            <div className='min-w-[850px] md:min-w-full grid grid-cols-[160px_1fr] sm:grid-cols-[200px_1fr]'>
              <div className='sticky left-0 top-0 z-30 bg-neutral-50 border-b border-r border-neutral-200 p-3 font-semibold text-sm text-neutral-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]'>
                Cliente
              </div>
              <div
                className='sticky top-0 z-20 grid border-b border-neutral-200 bg-neutral-50 divide-x divide-neutral-200'
                style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}
              >
                {days.map((day) => (
                  <div
                    key={day}
                    className='text-[11px] font-medium text-neutral-500 text-center py-3'
                  >
                    {day}
                  </div>
                ))}
              </div>
              {reservations.map((res) => {
                const config = statusColorMap[res.status]
                const startDay = getDay(res.startDate.toString())
                const endDay = getDay(res.endDate.toString())

                return (
                  <React.Fragment key={res.id}>
                    <div className='border-b sticky left-0 z-20 bg-white border-r border-neutral-200 flex items-center gap-2 px-3 h-14 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]'>
                      <User size={14} className='text-neutral-400 shrink-0' />
                      <span className='text-xs sm:text-sm font-medium text-neutral-800 truncate'>
                        {res.clientName || 'Cliente'}
                      </span>
                    </div>
                    <div
                      className='border-b relative border-neutral-200 h-14 bg-white grid'
                      style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}
                    >
                      {days.map((d) => (
                        <div
                          key={d}
                          className='border-r border-neutral-100 last:border-r-0 h-full'
                        />
                      ))}
                      <div
                        onClick={() => openModal(res.id)}
                        style={{
                          gridColumnStart: startDay,
                          gridColumnEnd: endDay + 1,
                        }}
                        className={`
                          absolute inset-y-2 left-1 right-1
                          z-10 rounded-md border px-2
                          flex items-center justify-start
                          cursor-pointer shadow-sm overflow-hidden
                          transition-all duration-200 hover:scale-[1.01] hover:shadow-md
                          ${config.bg} ${config.border} ${config.text}
                        `}
                      >
                        <span className='text-[11px] font-semibold truncate block w-full'>
                          {res.clientName}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <ReservationDetailModal reservation={currentReservationView} />
    </>
  )
}
