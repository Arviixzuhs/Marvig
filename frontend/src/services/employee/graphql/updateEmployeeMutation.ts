import { gql } from '@apollo/client'

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: Int!, $data: UpdateEmployeeDto!) {
    updateEmployee(id: $id, data: $data) {
      id
      name
      email
      phone
      address
      lastName
    }
  }
`
