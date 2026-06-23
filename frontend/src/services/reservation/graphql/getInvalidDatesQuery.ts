import { gql } from '@apollo/client'

export const GET_INVALID_DATES = gql`
  query GetInvalidDates($apartmentIds: [Int!]!, $reserveIdToExclude: Int) {
    getInvalidDates(apartmentIds: $apartmentIds, reserveIdToExclude: $reserveIdToExclude) {
      year
      month
      day
    }
  }
`