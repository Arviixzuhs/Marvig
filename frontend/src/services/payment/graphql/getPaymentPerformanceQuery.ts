import { gql } from '@apollo/client'

export const GET_PAYMENTS_PERFORMANCE = gql`
  query GetPaymentsPerformance($filters: PaymentFilterDto!) {
    getPaymentsPerformance(filters: $filters) {
      salesPerformanceData {
        name
        value
      }
      metrics {
        weeklySales {
          amount
          percentage
        }
        dailySales {
          amount
          percentage
        }
        totalSales {
          count
          percentage
        }
      }
    }
  }
`
