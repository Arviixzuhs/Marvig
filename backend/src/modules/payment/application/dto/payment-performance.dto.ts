export class PaymentPerformanceResponse {
  salesPerformanceData: { name: string; value: number }[]
  metrics: {
    weeklySales: { amount: string; percentage: string }
    dailySales: { amount: string; percentage: string }
    totalSales: { count: number; percentage: string }
  }
}
