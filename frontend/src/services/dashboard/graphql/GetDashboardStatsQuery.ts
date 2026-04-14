import { gql } from '@apollo/client'

export const GET_DASHBOARD_PERFORMANCE = gql`
  query GetDashboardPerformance(
    $paymentFilters: PaymentFilterDto!
    $expenseFilters: ExpenseFilterDto!
  ) {
    # Query de Pagos
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

    # Query de Gastos
    expenses: getExpensesPerformance(filters: $expenseFilters) {
      month
      MAINTENANCE
      UTILITIES
      CLEANING
      TAXES
      SUPPLIES
      OTHER
    }
  }
`
