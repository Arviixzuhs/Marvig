import { gql } from '@apollo/client'

export const PAYMENT_REPORT_QUERY = gql`
  query PaymentReport($filters: PaymentReportInput!) {
    paymentReport(filters: $filters) {
      content {
        id
        amount
        status
        method
        date
        reference
        description
        reservationId
        reservation {
          id
          startDate
          endDate
          clientName
          clientEmail
          apartments {
            id
            number
            floor
          }
        }
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`

export const EXPENSE_REPORT_QUERY = gql`
  query ExpenseReport($filters: ExpenseReportInput!) {
    expenseReport(filters: $filters) {
      content {
        id
        amount
        category
        date
        description
        paymentMethod
        apartmentId
        employeeId
        apartment {
          id
          number
          floor
        }
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`

export const RESERVATION_REPORT_QUERY = gql`
  query ReservationReport($filters: ReservationReportInput!) {
    reservationReport(filters: $filters) {
      content {
        id
        startDate
        endDate
        status
        type
        totalPrice
        totalPaid
        pendingAmount
        clientName
        clientEmail
        clientPhone
        apartments {
          id
          number
          floor
        }
        payments {
          id
          amount
          status
          method
          date
        }
      }
      totalItems
      totalPages
      currentPage
      rowsPerPage
    }
  }
`

export const OCCUPANCY_REPORT_QUERY = gql`
  query OccupancyReport($filters: OccupancyReportInput!) {
    occupancyReport(filters: $filters) {
      fromDate
      toDate
      apartments {
        apartmentId
        apartmentNumber
        floor
        totalNights
        occupiedNights
        blockedNights
        availableNights
        occupancyPercentage
        generatedIncome
      }
    }
  }
`

export const INCOME_SUMMARY_QUERY = gql`
  query IncomeSummary($filters: OccupancyReportInput!) {
    incomeSummary(filters: $filters) {
      totalIncome
      totalExpenses
      netProfit
      expensesByCategory {
        category
        amount
        percentage
      }
    }
  }
`
