import React from 'react'
import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { calculateReservationTotal } from '@/utils/calcTotalByApartmentAndDates'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { apartmentService } from '@/services/apartment'
import { reservationService } from '@/services/reservation'
import { useDispatch, useSelector } from 'react-redux'
import { tableColumns, modalInputs } from './data'
import { Autocomplete, AutocompleteChip } from '@/components/Autocomplete'
import {
  addItem,
  updateItem,
  deleteItem,
  setFormData,
  setTableData,
  setModalInputs,
  setTableColumns,
} from '@/features/appTableSlice'

export const AdminReservationPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()
  const [debounceValue] = useDebounce(table.filterValue, 100)
  const [totalCalculated, setTotalCalculated] = React.useState(0)

  const loadData = async () => {
    try {
      const response = await reservationService.getAll({
        page: table.currentPage,
        search: debounceValue,
        pageSize: table.rowsPerPage,
      })
      if (response) dispatch(setTableData(response))
    } catch (error) {
      console.error('Error loading reservations:', error)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [debounceValue, table.currentPage, table.rowsPerPage])

  React.useEffect(() => {
    dispatch(setModalInputs(modalInputs))
    dispatch(setTableColumns(tableColumns))
  }, [dispatch])

  const getPayload = () => {
    const { apartments, ...rest } = table.formData
    return {
      ...rest,
      apartmentIds: (apartments as AutocompleteChip[])?.map((item) => item.id) || [],
      totalPrice: totalCalculated,
    }
  }

  const tableActions: AppTableActions = {
    create: async () => {
      const response = await reservationService.create(getPayload())
      dispatch(addItem(response))
      toast.success('Reservación creada correctamente')
    },
    delete: async () => {
      await reservationService.delete(table.currentItemToDelete)
      dispatch(deleteItem(table.currentItemToDelete))
      toast.success('Reservación eliminada correctamente')
    },
    update: async () => {
      await reservationService.update(table.currentItemToUpdate, table.formData)
      dispatch(updateItem({ id: table.currentItemToUpdate, newData: table.formData }))
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
      tableActions={tableActions}
      searchbarPlaceholder='Buscar reservación...'
      modalExtension={
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
      }
    />
  )
}
