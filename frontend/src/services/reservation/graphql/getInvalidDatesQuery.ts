import { gql } from '@apollo/client'

export const GET_INVALID_DATES = gql`
  query GetInvalidDates($apartmentIds: [Int!]!) {
    getInvalidDates(apartmentIds: $apartmentIds) {
      year
      month
      day
    }
  }
`
