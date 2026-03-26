import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { GET_EMPLOYEE } from './graphql/getEmployeeQuery'
import { GET_EMPLOYEES } from './graphql/getEmployeesQuery'
import { DELETE_EMPLOYEE } from './graphql/deleteEmployeeMutation'
import { CREATE_EMPLOYEE } from './graphql/createEmployeeMutation'
import { UPDATE_EMPLOYEE } from './graphql/updateEmployeeMutation'
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
      variables: {
        filters,
      },
    })
    return data?.findEmployees || null
  },
  create: async (payload: Partial<EmployeeModel>) => {
    const { data } = await apolloClient.mutate<{ createEmployee: EmployeeModel }>({
      mutation: CREATE_EMPLOYEE,
      variables: {
        data: payload,
      },
    })
    return data?.createEmployee
  },
  update: async (id: number, payload: Partial<EmployeeModel>) => {
    const { data } = await apolloClient.mutate<{ updateEmployee: EmployeeModel }>({
      mutation: UPDATE_EMPLOYEE,
      variables: {
        id,
        data: payload,
      },
    })
    return data?.updateEmployee
  },
  delete: async (id: number): Promise<boolean> => {
    const { data } = await apolloClient.mutate<{ deleteEmployee: boolean }>({
      mutation: DELETE_EMPLOYEE,
      variables: { id },
    })
    return !!data?.deleteEmployee
  },
}
