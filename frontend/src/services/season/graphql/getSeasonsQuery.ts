import { gql } from '@apollo/client'
import { SEASON_FIELDS } from './seasonFragment'

export const FIND_SEASONS = gql`
  ${SEASON_FIELDS}
  query FindSeasons($filters: SeasonFilterInput!) {
    findSeasons(filters: $filters) {
      content {
        ...SeasonFields
      }
      totalPages
      totalItems
      currentPage
      rowsPerPage
    }
  }
`
