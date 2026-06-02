import React from 'react'
import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { setFormData } from '@/features/appTableSlice'
import { useTablePage } from '@/hooks/useTablePage'
import { IPageResponse } from '@/api/interfaces'
import { ApartmentStatus } from '@/models/ApartmentModel'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { apartmentService } from '@/services/apartment'
import { GET_RESERVATIONS } from '@/services/reservation/graphql/getReservationsQuery'
import { ReservationModel } from '@/models/ReservationModel'
import { reservationService } from '@/services/reservation'
import { useDispatch, useSelector } from 'react-redux'
import { calculateReservationTotal } from '@/utils/calcTotalByApartmentAndDates'
import { tableColumns, modalInputs } from './data'
import { Autocomplete, AutocompleteChip } from '@/components/Autocomplete'

export const AdminReservationPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()
  const [debounceValue] = useDebounce(table.filterValue, 100)
  const [totalCalculated, setTotalCalculated] = React.useState(0)

  useTablePage({ tableColumns, modalInputs })

  const { data, refetch } = useQuery<{ findReservations: IPageResponse<ReservationModel> }>(
    GET_RESERVATIONS,
    {
      variables: {
        filters: {
          page: table.currentPage,
          search: debounceValue,
          pageSize: table.rowsPerPage,
        },
      },
    },
  )

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

  const startDate = table.formData?.startDate
  const endDate = table.formData?.endDate
  const selectedApartments = table.formData?.apartments as AutocompleteChip[]

  const handleCalculateTotal = async () => {
    if (!startDate || !endDate || !selectedApartments?.length) {
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
          new Date(startDate as string),
          new Date(endDate as string),
          response.content,
        )
        setTotalCalculated(total)
        dispatch(setFormData({ name: 'totalPrice', value: total }))
      }
    } catch (error) {
      console.error('Error calculating total:', error)
    }
  }

  React.useEffect(() => {
    handleCalculateTotal()
  }, [startDate, endDate, selectedApartments])

  return (
    <AppTable
      totalPages={data?.findReservations.totalPages}
      tableContent={data?.findReservations.content || []}
      tableActions={tableActions}
      searchbarPlaceholder='Buscar reservación...'
      modalExtension={
        <>
          {table.currentItemToUpdate === -1 && (
            <div className='flex flex-col gap-4'>
              <div className='p-4 bg-primary-50 rounded-lg border border-primary-100'>
                <h3 className='text-lg font-semibold text-primary-700'>
                  Total Estimado: <span className='text-xl'>${totalCalculated.toFixed(2)}</span>
                </h3>
              </div>
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
                    status: ApartmentStatus.AVAILABLE,
                  })
                  return (
                    res?.content.map((item) => ({
                      id: item.id,
                      name: `Apto. ${item.number} - $${item.pricePerDay}/día`,
                    })) || []
                  )
                }}
              />
            </div>
          )}
        </>
      }
    />
  )
}
