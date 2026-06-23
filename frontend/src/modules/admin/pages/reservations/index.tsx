import React from 'react'
import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { useSelector } from 'react-redux'
import { useTablePage } from '@/hooks/useTablePage'
import { IPageResponse } from '@/api/interfaces'
import { PaymentMethod } from '@/models/PaymentModel'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { GET_RESERVATIONS } from '@/services/reservation/graphql/getReservationsQuery'
import { ReservationModel } from '@/models/ReservationModel'
import { AutocompleteChip } from '@/components/Autocomplete'
import { reservationService } from '@/services/reservation'
import { useCalendarContext } from '@/context/calendarContext'
import { EstimationWithCalendar } from './components/EstimationWithCalendar'
import { tableColumns, modalInputs } from './data'

export const AdminReservationPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const [debounceValue] = useDebounce(table.filterValue, 100)
  const [totalCalculated, setTotalCalculated] = React.useState(0)
  const { date } = useCalendarContext()

  useTablePage({ tableColumns, modalInputs })

  const { data, refetch, previousData } = useQuery<{
    findReservations: IPageResponse<ReservationModel>
  }>(GET_RESERVATIONS, {
    variables: {
      filters: {
        page: table.currentPage,
        search: debounceValue,
        pageSize: table.rowsPerPage,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  const currentReservationEdit = data?.findReservations.content.find(
    (item) => item.id === table.currentItemToUpdate,
  )

  const tableActions: AppTableActions = {
    create: async () => {
      const {
        apartments,
        paymentDate,
        paymentMethod,
        paymentReference,
        paymentDescription,
        ...rest
      } = table.formData

      await reservationService.create({
        ...rest,
        endDate: String(date?.end),
        startDate: String(date?.start),
        totalPrice: totalCalculated,
        apartmentIds: (apartments as AutocompleteChip[])?.map((item) => item.id) || [],
        payment: {
          date: paymentDate as Date,
          method: paymentMethod as PaymentMethod,
          reference: String(paymentReference),
          description: String(paymentDescription),
        },
      })

      await refetch()
      toast.success('Reservación creada correctamente')
    },
    delete: async () => {
      await reservationService.delete(table.currentItemToDelete)
      await refetch()
      toast.success('Reservación eliminada correctamente')
    },
    update: async () => {
      const { apartments, ...rest } = table.formData

      await reservationService.update(table.currentItemToUpdate, {
        ...rest,
        endDate: String(date?.end),
        startDate: String(date?.start),
        totalPrice: totalCalculated,
      })

      await refetch()
      toast.success('Reservación actualizada correctamente')
    },
  }

  return (
    <AppTable
      totalPages={data?.findReservations.totalPages || previousData?.findReservations.totalPages}
      tableContent={data?.findReservations.content || []}
      tableActions={tableActions}
      searchbarPlaceholder='Buscar reservación...'
      modalExtensionUp={
        <EstimationWithCalendar
          setTotalCalculated={setTotalCalculated}
          currentReservationEdit={currentReservationEdit}
        />
      }
    />
  )
}
