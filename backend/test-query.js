fetch('http://[::1]:3000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      query ExpenseReport($filters: ExpenseReportInput!) {
        expenseReport(filters: $filters) {
          totalItems
        }
      }
    `,
    variables: {
      filters: {
        page: 0,
        pageSize: 10,
        category: "MAINTENANCE",
        fromDate: "2025-12-03",
        toDate: "2026-06-10"
      }
    }
  })
}).then(r => r.json()).then(data => console.log(JSON.stringify(data, null, 2))).catch(e => console.error(e));
