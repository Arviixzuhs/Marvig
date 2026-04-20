import React from 'react'
import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { promotionService } from '@/services/promotion'
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

export const AdminPromotionPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()
  const [debounceValue] = useDebounce(table.filterValue, 100)

  const loadData = async () => {
    try {
      const response = await promotionService.getAll({
        page: table.currentPage,
        search: debounceValue,
        pageSize: table.rowsPerPage,
      })
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
      const response = await promotionService.create(table.formData)
      dispatch(addItem(response))
      toast.success('Promoción creada correctamente')
    },
    delete: async () => {
      await promotionService.delete(table.currentItemToDelete)
      dispatch(deleteItem(table.currentItemToDelete))
      toast.success('Promoción eliminada correctamente')
    },
    update: async () => {
      await promotionService.update(table.currentItemToUpdate, table.formData)
      dispatch(updateItem({ id: table.currentItemToUpdate, newData: table.formData }))
      toast.success('Promoción actualizada correctamente')
    },
  }

  return (
    <AppTable tableActions={tableActions} searchbarPlaceholder='Buscar promoción por nombre...' />
  )
}
