import { gql } from '@apollo/client'

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($data: EmployeeDto!) {
    createEmployee(data: $data) {
      id
      name
      email
      phone
      address
      lastName
    }
  }
`
