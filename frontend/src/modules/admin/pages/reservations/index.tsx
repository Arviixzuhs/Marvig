import React from 'react'
import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { DateValue } from '@internationalized/date'
import { useSelector } from 'react-redux'
import { useDebounce } from 'use-debounce'
import { useTablePage } from '@/hooks/useTablePage'
import { IPageResponse } from '@/api/interfaces'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { GET_RESERVATIONS } from '@/services/reservation/graphql/getReservationsQuery'
import { ReservationModel } from '@/models/ReservationModel'
import { AutocompleteChip } from '@/components/Autocomplete'
import { reservationService } from '@/services/reservation'
import { EstimationWithCalendar } from './components/EstimationWithCalendar'
import { tableColumns, modalInputs } from './data'

export const AdminReservationPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const [debounceValue] = useDebounce(table.filterValue, 100)
  const [value, setValue] = React.useState<{ start: DateValue; end: DateValue } | null>(null)
  const [totalCalculated, setTotalCalculated] = React.useState(0)

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

  const getPayload = () => {
    const {
      apartments,
      paymentDate,
      paymentDescription,
      paymentMethod,
      paymentReference,
      ...rest
    } = table.formData
    return {
      ...rest,
      apartmentIds: (apartments as AutocompleteChip[])?.map((item) => item.id) || [],
      totalPrice: totalCalculated,
      startDate: String(value?.start),
      endDate: String(value?.end),
      payment: {
        date: paymentDate,
        method: paymentMethod,
        reference: paymentReference,
        description: paymentDescription,
      },
    }
  }

  const tableActions: AppTableActions = {
    create: async () => {
      await reservationService.create(getPayload())
      await refetch()
      toast.success('Reservación creada correctamente')
    },
    delete: async () => {
      await reservationService.delete(table.currentItemToDelete)
      await refetch()
      toast.success('Reservación eliminada correctamente')
    },
    update: async () => {
      await reservationService.update(table.currentItemToUpdate, table.formData)
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
          value={value}
          setValue={setValue}
          totalCalculated={totalCalculated}
          setTotalCalculated={setTotalCalculated}
        />
      }
    />
  )
}
