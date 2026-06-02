import toast from 'react-hot-toast'
import { useQuery } from '@apollo/client/react'
import { AppTable } from '@/components/AppTable'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { useDebounce } from 'use-debounce'
import { useTablePage } from '@/hooks/useTablePage'
import { IPageResponse } from '@/api/interfaces'
import { GET_EMPLOYEES } from '@/services/employee/graphql/getEmployeesQuery'
import { EmployeeModel } from '@/models/EmployeeModel'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { employeeService } from '@/services/employee'
import { tableColumns, modalInputs } from './data'

export const AdminEmployeePage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const [debounceValue] = useDebounce(table.filterValue, 100)

  useTablePage({ tableColumns, modalInputs })

  const { data, refetch } = useQuery<{ findEmployees: IPageResponse<EmployeeModel> }>(
    GET_EMPLOYEES,
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
      await employeeService.create(table.formData as any)
      await refetch()
      toast.success('Empleado creado correctamente')
    },
    delete: async () => {
      await employeeService.delete(table.currentItemToDelete)
      await refetch()
      toast.success('Empleado eliminado correctamente')
    },
    update: async () => {
      await employeeService.update(table.currentItemToUpdate, table.formData)
      await refetch()
      toast.success('Empleado actualizado correctamente')
    },
  }

  return (
    <AppTable
      totalPages={data?.findEmployees.totalPages}
      tableContent={data?.findEmployees.content || []}
      tableActions={tableActions}
      searchbarPlaceholder='Buscar empleado por nombre...'
    />
  )
}
