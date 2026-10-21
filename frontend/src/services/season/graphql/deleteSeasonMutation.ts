import { gql } from '@apollo/client'

export const DELETE_SEASON = gql`
  mutation DeleteSeason($id: Int!) {
    deleteSeason(id: $id)
  }
`
