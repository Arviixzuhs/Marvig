import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { GET_USERS } from '@/services/user/graphql/getUsersQuery'
import { useDebounce } from 'use-debounce'
import { userService } from '@/services/user'
import { useSelector } from 'react-redux'
import { useTablePage } from '@/hooks/useTablePage'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { GetUsersResponseDto } from '@/models/UserModel'
import { tableColumns, modalInputs } from './data'

export const AdminUserPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const [debounceValue] = useDebounce(table.filterValue, 100)
  useTablePage({ tableColumns, modalInputs })

  const { data, refetch } = useQuery<GetUsersResponseDto>(GET_USERS, {
    variables: {
      filters: {
        page: table.currentPage,
        search: debounceValue,
        pageSize: table.rowsPerPage,
      },
    },
  })

  const tableActions: AppTableActions = {
    create: async () => {
      await userService.create(table.formData as any)
      await refetch()
      toast.success('Usuario creado correctamente')
    },
    delete: async () => {
      await userService.delete(table.currentItemToDelete)
      await refetch()
      toast.success('Usuario eliminado correctamente')
    },
    update: async () => {
      await userService.update(table.currentItemToUpdate, table.formData)
      await refetch()
      toast.success('Usuario actualizado correctamente')
    },
  }

  return (
    <AppTable
      hiddeAdd
      totalPages={data?.users.totalPages}
      tableContent={data?.users.content || []}
      tableActions={tableActions}
      searchbarPlaceholder='Buscar usuario por nombre...'
    />
  )
}
