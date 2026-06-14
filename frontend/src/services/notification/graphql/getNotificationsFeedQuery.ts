import { gql } from '@apollo/client'

export const GET_NOTIFICATIONS_FEED = gql`
  query GetNotificationsFeed($filters: NotificationFilterInput!) {
    findNotifications(filters: $filters) {
      content {
        id
        title
        body
        type
        status
        createdAt
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
    getUnreadNotificationsCount
  }
`
