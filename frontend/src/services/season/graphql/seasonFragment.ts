import { gql } from '@apollo/client'

export const SEASON_FIELDS = gql`
  fragment SeasonFields on Season {
    id
    name
    description
    startDate
    endDate
    value
    unit
    action
    type
    isActive
    apartmentIds
    createdAt
    updatedAt
  }
`
