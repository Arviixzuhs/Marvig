import { gql } from '@apollo/client'

export const GET_DASHBOARD_PERFORMANCE = gql`
  query GetDashboardPerformance(
    $paymentFilters: PaymentFilterInput!
    $expenseFilters: ExpenseFilterInput!
  ) {
    payments: getPaymentsPerformance(filters: $paymentFilters) {
      salesPerformanceData {
        name
        value
      }
      metrics {
        weeklySales {
          amount
          percentage
          isPositive
        }
        dailySales {
          amount
          percentage
          isPositive
        }
        totalSales {
          count
          percentage
          isPositive
        }
        profit {
          amount
          percentage
          isPositive
        }
      }
    }

    expensesData: getExpensesPerformance(filters: $expenseFilters) {
      expenses {
        month
        MAINTENANCE
        UTILITIES
        CLEANING
        TAXES
        SUPPLIES
        OTHER
      }
      metrics {
        totalExpenses {
          amount
          percentage
          isPositive
        }
        dailyExpenses {
          amount
          percentage
          isPositive
        }
      }
    }
  }
`
