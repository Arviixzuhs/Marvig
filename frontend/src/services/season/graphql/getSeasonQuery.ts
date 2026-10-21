import { gql } from '@apollo/client'
import { SEASON_FIELDS } from './seasonFragment'

export const GET_SEASON = gql`
  ${SEASON_FIELDS}
  query FindSeasonById($id: Int!) {
    findSeasonById(id: $id) {
      ...SeasonFields
    }
  }
`
