import React from 'react'
import toast from 'react-hot-toast'
import { Divider } from '@heroui/react'
import { AppTable } from '@/components/AppTable'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { fileService } from '@/services/file'
import { ImageUploader } from '@/components/ImageUploader'
import { expenseService } from '@/services/exepense'
import { useImageUpload } from '@/components/ImageUploader/providers/ImageUploaderProvider'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { useDispatch, useSelector } from 'react-redux'
import { tableColumns, modalInputs } from './data'
import { ExpenseModel, IExpenseImage } from '@/models/ExpenseModel'
import { deleteItem, setTableData, setModalInputs, setTableColumns } from '@/features/appTableSlice'

export const AdminExpensePage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const id = table.currentItemToUpdate
  const dispatch = useDispatch()
  const { formData, resetFormData, setImages, images } = useImageUpload()
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
      console.error('Error loading expenses:', error)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [debounceValue, table.currentPage, table.rowsPerPage])

  React.useEffect(() => {
    dispatch(setModalInputs(modalInputs))
    dispatch(setTableColumns(tableColumns))
  }, [])

  React.useEffect(() => {
    if (!table.currentItemToUpdate) {
      resetFormData()
      return
    }

    const itemToUpdate = table.data.find(
      (item: ExpenseModel) => item.id === table.currentItemToUpdate,
    )

    if (itemToUpdate?.images) {
      setImages(
        itemToUpdate.images.map((img: IExpenseImage) => ({
          id: String(img.id),
          imageURL: img.url,
        })),
      )
    }
  }, [table.currentItemToUpdate, table.data])

  const tableActions: AppTableActions = {
    create: async () => {
      try {
        const newExpense = await expenseService.create(table.formData)

        if (images.length > 0 && newExpense) {
          const uploadRes = await fileService.uploadFiles(formData)
          await expenseService.updateImages(newExpense.id, uploadRes.fileUrls)
        }

        resetFormData()
        await loadData()
        toast.success('Gasto registrado correctamente')
      } catch (error) {
        console.error(error)
        toast.error('Error al registrar el gasto')
      }
    },
    update: async () => {
      try {
        await expenseService.update(id, table.formData)

        const existingURLs = images
          .filter((img) => img.imageURL && !img.file)
          .map((img) => img.imageURL)

        let finalURLs = [...existingURLs]

        const containsNewFiles = images.some((img) => img.file)
        if (containsNewFiles) {
          const uploadRes = await fileService.uploadFiles(formData)
          finalURLs = [...finalURLs, ...uploadRes.fileUrls]
        }

        await expenseService.updateImages(id, finalURLs)

        resetFormData()
        await loadData()
        toast.success('Gasto actualizado correctamente')
      } catch (error) {
        console.error(error)
        toast.error('Error al actualizar el gasto')
      }
    },
    delete: async () => {
      try {
        await expenseService.delete(table.currentItemToDelete)
        dispatch(deleteItem(table.currentItemToDelete))
        toast.success('Gasto eliminado correctamente')
      } catch (error) {
        toast.error('Error al eliminar')
      }
    },
  }

  return (
    <AppTable
      modalExtension={
        <>
          <Divider />
          <ImageUploader />
        </>
      }
      tableActions={tableActions}
      searchbarPlaceholder='Buscar gastos...'
    />
  )
}
