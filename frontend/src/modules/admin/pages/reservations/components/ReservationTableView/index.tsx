import React from 'react'
import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { useTablePage } from '@/hooks/useTablePage'
import { PaymentMethod } from '@/models/PaymentModel'
import { IPageResponse } from '@/api/interfaces'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { GET_RESERVATIONS } from '@/services/reservation/graphql/getReservationsQuery'
import { AutocompleteChip } from '@/components/Autocomplete'
import { ReservationModel } from '@/models/ReservationModel'
import { useCalendarContext } from '@/context/calendarContext'
import { reservationService } from '@/services/reservation'
import { Edit, Info, Trash2 } from 'lucide-react'
import { ReservationDetailModal } from '@/modules/admin/pages/reservations/components/ReservationDetailModal'
import { EstimationWithCalendar } from './EstimationWithCalendar'
import { useDispatch, useSelector } from 'react-redux'
import { modalInputs, tableColumns } from './data'
import {
  toggleEditItemModal,
  toggleViewItemModal,
  setCurrentItemToView,
  setCurrentItemToDelete,
  setCurrentItemToUpdate,
  toggleConfirmDeleteModal,
} from '@/features/appTableSlice'

export const ReservationTableView = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const { date } = useCalendarContext()
  const [debounceValue] = useDebounce(table.filterValue, 100)
  const dispatch = useDispatch()
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

  const currentReservationEdit = data?.findReservations.content.find(
    (item) => item.id === table.currentItemToUpdate,
  )

  const currentReservationView = data?.findReservations.content.find(
    (item) => item.id === table.currentItemToView,
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
    <>
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
        dropdownItems={[
          {
            key: 'view',
            title: 'Ver detalles',
            startContent: <Info size={14} />,
            onPress: (itemId: number) => {
              dispatch(setCurrentItemToView(itemId))
              dispatch(toggleViewItemModal(null))
            },
          },
          {
            key: 'edit',
            title: 'Editar',
            startContent: <Edit size={14} />,
            onPress: (itemId: number) => {
              dispatch(setCurrentItemToUpdate(itemId))
              dispatch(toggleEditItemModal(null))
            },
          },
          {
            key: 'delete',
            title: <span className='text-danger'>Eliminar</span>,
            startContent: <Trash2 size={14} className='text-danger' />,
            onPress: (itemId: number) => {
              dispatch(setCurrentItemToDelete(itemId))
              dispatch(toggleConfirmDeleteModal(null))
            },
          },
        ]}
      />
      <ReservationDetailModal reservation={currentReservationView} />
    </>
  )
}
