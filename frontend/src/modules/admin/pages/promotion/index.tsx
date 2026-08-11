import toast from 'react-hot-toast'
import React from 'react'
import { AppTable } from '@/components/AppTable'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { setFormData } from '@/features/appTableSlice'
import { useDebounce } from 'use-debounce'
import { useTablePage } from '@/hooks/useTablePage'
import { IPageResponse } from '@/api/interfaces'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { FIND_PROMOTIONS } from '@/services/promotion/graphql/findPromotionsQuery'
import { promotionService } from '@/services/promotion'
import { useDispatch, useSelector } from 'react-redux'
import { tableColumns, modalInputs } from './data'
import { PromotionModel, PromotionType } from '@/models/PromotionModel'

export const AdminPromotionPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const [debounceValue] = useDebounce(table.filterValue, 100)
  const dispatch = useDispatch()
  useTablePage({ tableColumns, modalInputs })

  const { data, refetch, previousData } = useQuery<{
    findPromotions: IPageResponse<PromotionModel>
  }>(FIND_PROMOTIONS, {
    variables: {
      filters: {
        page: table.currentPage,
        type: table.filters['type'],
        search: debounceValue,
        pageSize: table.rowsPerPage,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  React.useEffect(() => {
    if (table.formData['type']) {
      dispatch(
        setFormData({
          name: 'value',
          value: '',
        }),
      )
    }
  }, [table.formData['type']])

  React.useEffect(() => {
    if (
      table.formData['type'] === PromotionType.PERCENTAGE &&
      Number(table.formData['value']) > 100
    ) {
      dispatch(
        setFormData({
          name: 'value',
          value: 100,
        }),
      )
    }
  }, [table.formData['value']])

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
      totalPages={data?.findPromotions.totalPages || previousData?.findPromotions.totalPages}
      tableContent={data?.findPromotions.content || []}
      tableActions={tableActions}
      searchbarPlaceholder='Buscar promoción por nombre...'
    />
  )
}
