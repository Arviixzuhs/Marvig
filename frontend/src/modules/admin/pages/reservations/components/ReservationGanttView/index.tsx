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
    bg: 'bg-[#fef3c7] dark:bg-[#282015]',
    border: 'border-[#fde68a] dark:border-[#45331d]',
    text: 'text-[#b45309] dark:text-[#fcd34d]',
    label: 'Pendiente',
  },
  [ReservationStatus.CONFIRMED]: {
    bg: 'bg-[#d1fae5] dark:bg-[#13271d]',
    border: 'border-[#a7f3d0] dark:border-[#1b4332]',
    text: 'text-[#047857] dark:text-[#6ee7b7]',
    label: 'Confirmado',
  },
  [ReservationStatus.CANCELLED]: {
    // Derivados sólidos de tu color destructivo oklch(0.60 0.22 27.3)
    bg: 'bg-[#fee2e2] dark:bg-[#2c1616]',
    border: 'border-[#fecaca] dark:border-[#4c1d1d]',
    text: 'text-[#dc2626] dark:text-[#f87171]',
    label: 'Cancelado',
  },
  [ReservationStatus.COMPLETED]: {
    // Utiliza directamente los niveles de tu escala neutra default sin opacidades
    bg: 'bg-default-200 dark:bg-default-100',
    border: 'border-default-300 dark:border-default-200',
    text: 'text-default-600 dark:text-default-400',
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
    dispatch(setCurrentItemToView(id))
    dispatch(toggleViewItemModal(null))
  }

  const currentReservationView = data?.findReservations.content.find(
    (item) => item.id === table.currentItemToView,
  )

  return (
    <>
      <div className='bg-card text-foreground rounded-xl p-4 sm:p-6 w-full max-w-full h-full flex flex-col min-h-0'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4 mb-4 shrink-0'>
          <div className='flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start'>
            <div className='flex bg-default-100 rounded-lg p-0.5'>
              <ButtonGroup size='sm'>
                <Button variant='flat' isIconOnly size='sm' onPress={prevMonth}>
                  <ChevronLeft size={16} />
                </Button>
                <Button variant='flat' isIconOnly size='sm' onPress={nextMonth}>
                  <ChevronRight size={16} />
                </Button>
              </ButtonGroup>
            </div>
            <h2 className='font-bold text-lg sm:text-xl capitalize whitespace-nowrap text-foreground'>
              {MONTHS[month]} {year}
            </h2>
          </div>
          <div className='flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground'>
            {Object.values(statusColorMap).map((item) => (
              <div key={item.label} className='flex items-center gap-1.5 whitespace-nowrap'>
                <span className={`w-3 h-3 rounded-full border ${item.bg} ${item.border}`} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        {reservations.length === 0 && <EmptyContent />}
        {reservations.length > 0 && (
          <div className='flex-1 min-h-0 overflow-x-auto hoverScrollbar overflow-y-auto border border-border rounded-lg scrollbar-thin select-none'>
            <div className='min-w-[850px] md:min-w-full grid grid-cols-[160px_1fr] sm:grid-cols-[200px_1fr]'>
              {/* Header: Cliente */}
              <div className='sticky left-0 top-0 z-30 bg-default-50 border-b border-r border-border p-3 font-semibold text-sm text-foreground '>
                Cliente
              </div>

              {/* Header: Días del Mes */}
              <div
                className='sticky top-0 z-20 grid border-b border-border bg-default-50 divide-x divide-border'
                style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}
              >
                {days.map((day) => (
                  <div
                    key={day}
                    className='text-[11px] font-medium text-muted-foreground text-center py-3'
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Filas de Reservaciones */}
              {reservations.map((res) => {
                const config = statusColorMap[res.status]
                const startDay = getDay(res.startDate.toString())
                const endDay = getDay(res.endDate.toString())

                return (
                  <React.Fragment key={res.id}>
                    {/* Celda del Cliente */}
                    <div className='bg-card border-b sticky left-0 z-20 border-r border-border flex items-center gap-2 px-3 h-14 '>
                      <User size={14} className='text-muted-foreground shrink-0' />
                      <span className='text-xs sm:text-sm font-medium text-foreground truncate'>
                        {res.clientName || 'Cliente'}
                      </span>
                    </div>

                    {/* Fila del Gantt (Cuadrícula del mes) */}
                    <div
                      className='border-b relative border-border h-14 bg-card grid'
                      style={{ gridTemplateColumns: `repeat(${daysInMonth}, minmax(0, 1fr))` }}
                    >
                      {days.map((d) => (
                        <div
                          key={d}
                          className='border-r border-default-200/50 dark:border-default-200/20 last:border-r-0 h-full'
                        />
                      ))}

                      {/* Barra de la Reservación */}
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
