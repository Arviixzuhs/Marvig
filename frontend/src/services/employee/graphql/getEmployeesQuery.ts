import { gql } from '@apollo/client'

export const GET_EMPLOYEES = gql`
  query FindEmployees($filters: EmployeeFilterInput!) {
    findEmployees(filters: $filters) {
      content {
        id
        name
        email
        phone
        address
        lastName
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`
