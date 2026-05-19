import { gql } from '@apollo/client'

export const GET_INVALID_DATES = gql`
  query GetInvalidDates($apartmentId: Int!) {
    getInvalidDates(apartmentId: $apartmentId) {
      year
      month
      day
    }
  }
`
