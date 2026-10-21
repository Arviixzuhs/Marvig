import { gql } from '@apollo/client'

export const CALCULATE_RESERVATION_TOTAL = gql`
  query CalculateReservationTotal($data: CalculateReservationTotalInput!) {
    calculateReservationTotal(data: $data)
  }
`
