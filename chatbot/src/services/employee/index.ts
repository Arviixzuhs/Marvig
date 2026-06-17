import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { GET_EMPLOYEE } from './graphql/getEmployeeQuery'
import { GET_EMPLOYEES } from './graphql/getEmployeesQuery'
import { EmployeeModel, IEmployeeFilter } from '@/models/EmployeeModel'

export const employeeService = {
  get: async (id: number): Promise<EmployeeModel | null> => {
    const { data } = await apolloClient.mutate<{ employee: EmployeeModel }>({
      mutation: GET_EMPLOYEE,
      variables: {
        data: {
          id,
        },
      },
    })
    return data?.employee || null
  },
  getAll: async (filters: IEmployeeFilter): Promise<IPageResponse<EmployeeModel> | null> => {
    const { data } = await apolloClient.query<{ findEmployees: IPageResponse<EmployeeModel> }>({
      query: GET_EMPLOYEES,
      fetchPolicy: 'network-only',
      variables: {
        filters,
      },
    })
    return data?.findEmployees || null
  },
}
