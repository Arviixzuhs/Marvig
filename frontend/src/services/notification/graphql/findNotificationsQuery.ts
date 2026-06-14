import { gql } from '@apollo/client'

export const FIND_NOTIFICATIONS = gql`
  query FindNotifications($filters: NotificationFilterInput!) {
    findNotifications(filters: $filters) {
      content {
        id
        title
        message
        isRead
        createdAt
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`
