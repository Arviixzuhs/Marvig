import React from 'react'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { inputStyles } from '@/styles'
import { useDebounce } from 'use-debounce'
import { IPageResponse } from '@/api/interfaces'
import { UserPageLayout } from '@/layout/UserPageLayout'
import { formatCurrency } from '@/utils/formatCurrency'
import { GET_RESERVATIONS } from '@/services/reservation/graphql/getReservationsQuery'
import { getFormattedDateTime } from '@/utils/getFormattedDateTime'
import { ReservationDetailModal } from '@/modules/admin/pages/reservations/components/ReservationDetailModal'
import { useDispatch, useSelector } from 'react-redux'
import { Calendar, Info, Search, Users } from 'lucide-react'
import { ReservationModel, ReservationStatus } from '@/models/ReservationModel'
import { setCurrentItemToView, toggleViewItemModal } from '@/features/appTableSlice'
import { Button, Card, CardBody, CardFooter, Chip, Input, Pagination, Spinner } from '@heroui/react'

const statusConfig = {
  [ReservationStatus.PENDING]: { label: 'Pendiente', color: 'warning' as const },
  [ReservationStatus.CONFIRMED]: { label: 'Confirmada', color: 'success' as const },
  [ReservationStatus.CANCELLED]: { label: 'Cancelada', color: 'danger' as const },
  [ReservationStatus.COMPLETED]: { label: 'Completada', color: 'default' as const },
}

export const MyReservationsPage = () => {
  const dispatch = useDispatch()
  const table = useSelector((state: RootState) => state.appTable)

  const [searchFilter, setSearchFilter] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)

  const [debounceSearch] = useDebounce(searchFilter, 200)

  const rowsPerPage = 8

  const { data, loading } = useQuery<{
    findReservations: IPageResponse<ReservationModel>
  }>(GET_RESERVATIONS, {
    variables: {
      filters: {
        page: currentPage - 1,
        search: debounceSearch,
        pageSize: rowsPerPage,
        mine: true,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  React.useEffect(() => {
    setCurrentPage(1)
  }, [debounceSearch])

  const pageData = data?.findReservations
  const reservations = pageData?.content || []
  const totalPages = pageData?.totalPages || 1

  const handleOpenDetails = (itemId: number) => {
    dispatch(setCurrentItemToView(itemId))
    dispatch(toggleViewItemModal(null))
  }

  const currentReservationView = reservations.find((item) => item.id === table.currentItemToView)

  return (
    <UserPageLayout>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-default-800'>Mis Reservas</h1>
            <p className='text-sm text-default-400'>
              Gestiona y visualiza el estado de tus estadías
            </p>
          </div>

          <Input
            size='md'
            variant='flat'
            isClearable
            className='w-full sm:max-w-xs'
            placeholder='Buscar reserva...'
            startContent={<Search size={16} />}
            value={searchFilter}
            classNames={inputStyles}
            onValueChange={setSearchFilter}
          />
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <Spinner size='lg' label='Cargando tus reservas...' color='primary' />
          </div>
        ) : reservations.length === 0 ? (
          <div className='flex flex-col items-center justify-center pt-30 w-full text-center'>
            <Calendar size={48} className='text-default-300' />

            <p className='text-default-500 font-medium mt-3'>No encontramos reservas activas</p>

            <p className='text-xs text-default-400 mt-1'>
              Si realizaste una compra recientemente, espera unos minutos.
            </p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {reservations.map((reservation) => (
                <Card
                  key={reservation.id}
                  isPressable
                  shadow='none'
                  onPress={() => handleOpenDetails(reservation.id)}
                >
                  <CardBody className='flex flex-col gap-4 p-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs font-bold text-default-400'>
                        #RSV-{reservation.id}
                      </span>

                      <Chip
                        size='sm'
                        variant='flat'
                        color={statusConfig[reservation.status]?.color || 'default'}
                      >
                        {statusConfig[reservation.status]?.label || reservation.status}
                      </Chip>
                    </div>

                    <div className='flex items-start gap-3 bg-default-50 p-2.5 rounded-xl'>
                      <Calendar size={18} className='text-primary' />
                      <div className='flex flex-col text-xs'>
                        <span className='text-default-400 font-medium'>Estadía</span>
                        <span className='font-semibold text-default-700'>
                          {getFormattedDateTime({ value: reservation.startDate })} -{' '}
                          {getFormattedDateTime({ value: reservation.endDate })}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center gap-2 text-xs text-default-500'>
                      <Users size={15} />
                      <span>{reservation.persons || 0} Huéspedes</span>
                    </div>
                  </CardBody>

                  <CardFooter className='flex justify-between items-center border-t border-default-100 px-4 py-3'>
                    <span className='text-base font-bold text-success-600'>
                      {formatCurrency(reservation.totalPrice)}
                    </span>

                    <Button
                      size='sm'
                      variant='light'
                      color='primary'
                      startContent={<Info size={14} />}
                      onPress={() => handleOpenDetails(reservation.id)}
                    >
                      Detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className='flex justify-center mt-6'>
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color='primary'
                  page={currentPage}
                  total={totalPages}
                  onChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}

        <ReservationDetailModal reservation={currentReservationView} />
      </div>
    </UserPageLayout>
  )
}
