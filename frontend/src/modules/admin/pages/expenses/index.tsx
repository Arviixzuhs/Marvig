import toast from 'react-hot-toast'
import { Divider } from '@heroui/react'
import { AppTable } from '@/components/AppTable'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { useSelector } from 'react-redux'
import { fileService } from '@/services/file'
import { GET_EXPENSES } from '@/services/exepense/graphql/getExpensesQuery'
import { ExpenseModel } from '@/models/ExpenseModel'
import { useTablePage } from '@/hooks/useTablePage'
import { ImageUploader } from '@/components/ImageUploader'
import { IPageResponse } from '@/api/interfaces'
import { expenseService } from '@/services/exepense'
import { useImageUpload } from '@/components/ImageUploader/providers/ImageUploaderProvider'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { tableColumns, modalInputs } from './data'

export const AdminExpensePage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const id = table.currentItemToUpdate
  const { formData, images } = useImageUpload()
  const [debounceValue] = useDebounce(table.filterValue, 100)

  useTablePage({ tableColumns, modalInputs })

  const { data, refetch, previousData } = useQuery<{ findExpenses: IPageResponse<ExpenseModel> }>(
    GET_EXPENSES,
    {
      variables: {
        filters: {
          page: table.currentPage,
          search: debounceValue,
          pageSize: table.rowsPerPage,
          category: table.filters['category'],
          paymentMethod: table.filters['paymentMethod'],
          fromDate: table.dateFilter.start,
          toDate: table.dateFilter.end,
        },
      },
      notifyOnNetworkStatusChange: true,
    },
  )

  const tableActions: AppTableActions = {
    create: async () => {
      try {
        const newExpense = await expenseService.create(table.formData)

        if (images.length > 0 && newExpense) {
          const uploadRes = await fileService.uploadFiles(formData)
          await expenseService.updateImages(newExpense.id, uploadRes.fileUrls)
        }

        await refetch()
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

        await refetch()
        toast.success('Gasto actualizado correctamente')
      } catch (error) {
        console.error(error)
        toast.error('Error al actualizar el gasto')
      }
    },
    delete: async () => {
      try {
        await expenseService.delete(table.currentItemToDelete)
        await refetch()
        toast.success('Gasto eliminado correctamente')
      } catch (error) {
        toast.error('Error al eliminar')
      }
    },
  }

  return (
    <AppTable
      totalPages={data?.findExpenses.totalPages || previousData?.findExpenses.totalPages}
      tableContent={data?.findExpenses.content || []}
      filterByDate
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
