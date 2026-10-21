import { gql } from '@apollo/client'
import { SEASON_FIELDS } from './seasonFragment'

export const UPDATE_SEASON = gql`
  ${SEASON_FIELDS}
  mutation UpdateSeason($data: UpdateSeasonInput!) {
    updateSeason(data: $data) {
      ...SeasonFields
    }
  }
`
