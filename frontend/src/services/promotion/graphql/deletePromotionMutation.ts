import { gql } from '@apollo/client'

export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($id: Int!) {
    deletePromotion(id: $id)
  }
`
