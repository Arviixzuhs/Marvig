import React from 'react'
import { Button, Card, CardBody, Chip, Select, SelectItem, Tab, Tabs } from '@heroui/react'
import { Download, TrendingUp } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { IPaymentPerformance } from '@/models/PaymentModel'
import { dashboardService } from '@/services/dashboard'
import { IExpensePerformance } from '@/models/ExpenseModel'
import { tableColumns } from '../expenses/data'
import { formatCurrency } from '@/utils/formatCurrency'
import { AdminPaymentPage } from '../payments'

const getRangeDates = (range: string) => {
  const toDate = new Date()
  const fromDate = new Date()

  switch (range) {
    case '1week':
      fromDate.setDate(toDate.getDate() - 7)
      break
    case '2weeks':
      fromDate.setDate(toDate.getDate() - 14)
      break
    case 'month':
      fromDate.setMonth(toDate.getMonth() - 1)
      break
    case 'year':
      fromDate.setFullYear(toDate.getFullYear() - 1)
      break
    default:
      fromDate.setDate(toDate.getDate() - 14)
  }

  return {
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
  }
}

const StatCard = ({
  label,
  value,
  change,
  isPositive = true,
}: {
  label: string
  value: string
  change: string
  isPositive?: boolean
}) => (
  <Card shadow='none' className='border-none bg-white'>
    <CardBody className='p-6'>
      <p className='text-sm text-default-500 mb-2'>{label}</p>
      <div className='flex items-end justify-between'>
        <div className='text-3xl font-bold text-foreground'>{value}</div>
        <Chip size='sm' variant='flat' color={isPositive ? 'success' : 'danger'}>
          <div
            className={`text-sm font-semibold flex items-center gap-1 ${
              isPositive ? 'text-success' : 'text-danger'
            }`}
          >
            <TrendingUp className='w-4 h-4' />
            {change}
          </div>
        </Chip>
      </div>
    </CardBody>
  </Card>
)

export const AdminDashboardPage = () => {
  const [data, setData] = React.useState<{
    salesPerformanceData: IPaymentPerformance
    expensesPerformanceData: IExpensePerformance[]
  } | null>(null)

  const [selectedRange, setSelectedRange] = React.useState('2weeks')
  const [filters, setFilters] = React.useState(getRangeDates('2weeks'))

  const loadData = async () => {
    try {
      const response = await dashboardService.getStats({
        expenseFilters: {
          fromDate: filters.fromDate,
          toDate: filters.toDate,
        },
        paymentFilters: {
          fromDate: filters.fromDate,
          toDate: filters.toDate,
        },
      })

      if (response) {
        setData({
          expensesPerformanceData: response.expenses,
          salesPerformanceData: response.payments,
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [filters])

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (!value) return

    setSelectedRange(value)
    setFilters(getRangeDates(value))
  }

  const categoryConfig = tableColumns.find((c) => c.uid === 'category')?.chipConfig || {}

  return (
    <div className='flex flex-col gap-3 h-full'>
      <div className='flex items-center justify-between'>
        <Tabs variant='solid' aria-label='Dashboard views' color='primary' radius='full'>
          <Tab key='overview' title='Todo' />
          <Tab key='sales' title='Ventas' />
          <Tab key='expenses' title='Gastos' />
        </Tabs>
        <div className='items-center gap-3 sm:flex hidden'>
          <div>
            <Select
              selectedKeys={[selectedRange]}
              onChange={handleRangeChange}
              size='sm'
              variant='bordered'
              className='w-48'
              aria-label='Time range'
            >
              <SelectItem key='1week'>Ultima semana</SelectItem>
              <SelectItem key='2weeks'>Últimas 2 semanas</SelectItem>
              <SelectItem key='month'>Último mes</SelectItem>
              <SelectItem key='year'>Último año</SelectItem>
            </Select>
          </div>
          <div>
            <Button
              variant='flat'
              startContent={<Download className='w-4 h-4' />}
              className='text-default-700 font-medium'
            >
              Descargar
            </Button>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
        <StatCard
          label='Ventas diarias'
          value={formatCurrency(Number(data?.salesPerformanceData.metrics.dailySales.amount || 0))}
          change={data?.salesPerformanceData.metrics.dailySales.percentage || '0%'}
          isPositive={data?.salesPerformanceData.metrics.dailySales.isPositive}
        />
        <StatCard
          label='Ventas semanales'
          value={formatCurrency(Number(data?.salesPerformanceData.metrics.weeklySales.amount || 0))}
          change={data?.salesPerformanceData.metrics.weeklySales.percentage || '0%'}
          isPositive={data?.salesPerformanceData.metrics.weeklySales.isPositive}
        />
        <StatCard
          label='Ventas Totales'
          value={String(data?.salesPerformanceData.metrics.totalSales.count || 0)}
          change={data?.salesPerformanceData.metrics.totalSales.percentage || '0%'}
          isPositive={data?.salesPerformanceData.metrics.totalSales.isPositive}
        />
        <StatCard
          label='Ganancias'
          value={formatCurrency(Number(data?.salesPerformanceData.metrics.profit.amount || 0))}
          change={data?.salesPerformanceData.metrics.profit.percentage || '0%'}
          isPositive={data?.salesPerformanceData.metrics.profit.isPositive}
        />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
        <Card shadow='none' className='lg:col-span-2'>
          <CardBody className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-lg font-bold text-foreground mb-4'>Estadísticas de Ventas</h2>
                <div className='flex gap-8'>
                  <div>
                    <p className='text-sm text-default-500'>Ventas Semanales</p>
                    <p className='text-2xl font-bold text-foreground'>
                      {formatCurrency(
                        Number(data?.salesPerformanceData.metrics.weeklySales.amount || 0),
                      )}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-default-500'>Ventas Diarias</p>
                    <p className='text-2xl font-bold text-foreground'>
                      {formatCurrency(
                        Number(data?.salesPerformanceData.metrics.dailySales.amount || 0),
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={data?.salesPerformanceData.salesPerformanceData || []}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' vertical={false} />
                  <XAxis
                    dataKey='name'
                    stroke='#9ca3af'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke='#9ca3af' fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey='value' fill='#006FEE' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card shadow='none'>
          <CardBody className='p-6'>
            <h2 className='text-lg mb-6 font-bold text-foreground'>Gastos por Categoría</h2>
            <div className='flex flex-wrap gap-4 mb-6'>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <div key={key} className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: config.color }}
                  ></div>
                  <span className='text-sm text-default-500'>{config.label}</span>
                </div>
              ))}
            </div>
            <div className='h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={data?.expensesPerformanceData || []}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' vertical={false} />
                  <XAxis
                    dataKey='month'
                    stroke='#9ca3af'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke='#9ca3af' fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <Line
                      key={key}
                      type='monotone'
                      dataKey={key}
                      name={config.label}
                      stroke={config.color}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className='flex gap-2 flex-col'>
        <h2 className='text-lg font-bold text-foreground'>Últimos pagos</h2>
        <AdminPaymentPage hiddeTopContent />
      </div>
    </div>
  )
}
