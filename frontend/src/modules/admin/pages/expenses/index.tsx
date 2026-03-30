import React from 'react'
import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { expenseService } from '@/services/exepense'
import { ExpenseCategory } from '@/models/ExpenseModel'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
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

export const AdminExepensePage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()
  const [debounceValue] = useDebounce(table.filterValue, 100)

  const loadData = async () => {
    try {
      const response = await expenseService.getAll({
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
      const response = await expenseService.create({
        ...table.formData,
        amount: Number(table.formData.amount),
        category: ExpenseCategory.MAINTENANCE
      })
      dispatch(addItem(response))
      toast.success('Gasto creado correctamente')
    },
    delete: async () => {
      await expenseService.delete(table.currentItemToDelete)
      dispatch(deleteItem(table.currentItemToDelete))
      toast.success('Gasto eliminado correctamente')
    },
    update: async () => {
      await expenseService.update(table.currentItemToUpdate, table.formData)
      dispatch(updateItem({ id: table.currentItemToUpdate, newData: table.formData }))
      toast.success('Gasto actualizado correctamente')
    },
  }

  return (
    <AppTable tableActions={tableActions} searchbarPlaceholder='Buscar gasto por descripción...' />
  )
}
