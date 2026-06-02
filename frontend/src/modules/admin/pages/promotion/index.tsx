import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { useSelector } from 'react-redux'
import { useTablePage } from '@/hooks/useTablePage'
import { IPageResponse } from '@/api/interfaces'
import { PromotionModel } from '@/models/PromotionModel'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { FIND_PROMOTIONS } from '@/services/promotion/graphql/findPromotionsQuery'
import { promotionService } from '@/services/promotion'
import { tableColumns, modalInputs } from './data'

export const AdminPromotionPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const [debounceValue] = useDebounce(table.filterValue, 100)
  useTablePage({ tableColumns, modalInputs })

  const { data, refetch } = useQuery<{ findPromotions: IPageResponse<PromotionModel> }>(
    FIND_PROMOTIONS,
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

  const tableActions: AppTableActions = {
    create: async () => {
      await promotionService.create(table.formData)
      await refetch()
      toast.success('Promoción creada correctamente')
    },
    delete: async () => {
      await promotionService.delete(table.currentItemToDelete)
      await refetch()
      toast.success('Promoción eliminada correctamente')
    },
    update: async () => {
      await promotionService.update(table.currentItemToUpdate, table.formData)
      await refetch()
      toast.success('Promoción actualizada correctamente')
    },
  }

  return (
    <AppTable
      totalPages={data?.findPromotions.totalPages}
      tableContent={data?.findPromotions.content || []}
      tableActions={tableActions}
      searchbarPlaceholder='Buscar promoción por nombre...'
    />
  )
}
