import React from 'react'
import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { reservationService } from '@/services/reservation'
import { useDispatch, useSelector } from 'react-redux'
import { tableColumns, modalInputs } from './data'
import {
  addItem,
  updateItem,
  deleteItem,
  setTableData,
  setModalInputs,
  setTableColumns,
} from '@/features/appTableSlice'

export const AdminReservationPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()
  const [debounceValue] = useDebounce(table.filterValue, 100)

  const loadData = async () => {
    try {
      const response = await reservationService.getAll({
        page: table.currentPage,
        search: debounceValue,
        pageSize: table.rowsPerPage,
      })
      console.log(response)
      if (!response) return

      dispatch(setTableData(response))
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [debounceValue, table.currentPage, table.rowsPerPage])

  React.useEffect(() => {
    dispatch(setModalInputs(modalInputs))
    dispatch(setTableColumns(tableColumns))
  }, [])

  const tableActions: AppTableActions = {
    create: async () => {
      const response = await reservationService.create(table.formData)
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

  return (
    <AppTable tableActions={tableActions} searchbarPlaceholder='Buscar reservación...' />
  )
}
