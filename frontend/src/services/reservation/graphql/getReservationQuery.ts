import { gql } from '@apollo/client'

export const GET_RESERVATION = gql`
  query FindReservation($id: Int!) {
    findReservation(id: $id) {
      id   
      clientName
      clientPhone
      clientEmail
      startDate
      endDate
      type
      status
      totalPrice
      userId
      apartmentId
    }
  }
`
