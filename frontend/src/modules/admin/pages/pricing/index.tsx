import toast from 'react-hot-toast'
import React from 'react'
import { AppTable } from '@/components/AppTable'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { setFormData } from '@/features/appTableSlice'
import { useDebounce } from 'use-debounce'
import { useTablePage } from '@/hooks/useTablePage'
import { FIND_SEASONS } from '@/services/season/graphql/getSeasonsQuery'
import { IPageResponse } from '@/api/interfaces'
import { seasonService } from '@/services/season'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { useDispatch, useSelector } from 'react-redux'
import { tableColumns, modalInputs } from './data'
import { SeasonModel, AdjustmentUnit, ICreateSeasonPayload } from '@/models/SeasonModel'

export const AdminPricingPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const [debounceValue] = useDebounce(table.filterValue, 100)
  const dispatch = useDispatch()
  useTablePage({ tableColumns, modalInputs })

  const { data, refetch, previousData } = useQuery<{
    findSeasons: IPageResponse<SeasonModel>
  }>(FIND_SEASONS, {
    variables: {
      filters: {
        page: table.currentPage,
        types: table.filters['type'],
        units: table.filters['unit'],
        actions: table.filters['action'],
        fromDate: table.dateFilter.start,
        toDate: table.dateFilter.end,
        name: debounceValue,
        pageSize: table.rowsPerPage,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  React.useEffect(() => {
    if (table.formData['unit']) {
      dispatch(
        setFormData({
          name: 'value',
          value: '',
        }),
      )
    }
  }, [table.formData['unit']])

  React.useEffect(() => {
    if (
      table.formData['unit'] === AdjustmentUnit.PERCENTAGE &&
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
      await seasonService.create(table.formData as unknown as ICreateSeasonPayload)
      await refetch()
      toast.success('Temporada creada correctamente')
    },
    delete: async () => {
      await seasonService.delete(table.currentItemToDelete)
      await refetch()
      toast.success('Temporada eliminada correctamente')
    },
    update: async () => {
      await seasonService.update(table.currentItemToUpdate, table.formData)
      await refetch()
      toast.success('Temporada actualizada correctamente')
    },
  }

  return (
    <AppTable
      filterByDate
      totalPages={data?.findSeasons.totalPages || previousData?.findSeasons.totalPages}
      tableContent={data?.findSeasons.content || []}
      tableActions={tableActions}
      searchbarPlaceholder='Buscar temporada por nombre...'
    />
  )
}
