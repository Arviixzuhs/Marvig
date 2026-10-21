import { gql } from '@apollo/client'
import { SEASON_FIELDS } from './seasonFragment'

export const CREATE_SEASON = gql`
  ${SEASON_FIELDS}
  mutation CreateSeason($data: CreateSeasonInput!) {
    createSeason(data: $data) {
      ...SeasonFields
    }
  }
`
