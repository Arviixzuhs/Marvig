import React from 'react'
import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { userService } from '@/services/user'
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

export const AdminUserPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()
  const [debounceValue] = useDebounce(table.filterValue, 100)

  const loadData = async () => {
    try {
      const response = await userService.getAll({
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
      const response = await userService.create(table.formData as any)
      dispatch(addItem(response))
      toast.success('Usuario creado correctamente')
    },
    delete: async () => {
      await userService.delete(table.currentItemToDelete)
      dispatch(deleteItem(table.currentItemToDelete))
      toast.success('Usuario eliminado correctamente')
    },
    update: async () => {
      await userService.update(table.currentItemToUpdate, table.formData)
      dispatch(updateItem({ id: table.currentItemToUpdate, newData: table.formData }))
      toast.success('Usuario actualizado correctamente')
    },
  }

  return (
    <AppTable tableActions={tableActions} searchbarPlaceholder='Buscar usuario por nombre...' />
  )
}
