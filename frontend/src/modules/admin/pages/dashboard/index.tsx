import { Button, Card, CardBody, Select, SelectItem, Tab, Tabs } from '@heroui/react'
import { Download, MoreVertical, TrendingUp } from 'lucide-react'
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

import React from 'react'
import { IPaymentPerformance } from '@/models/PaymentModel'
import { dashboardService } from '@/services/dashboard'
import { IExpensePerformance } from '@/models/ExpenseModel'
import { tableColumns } from '../expenses/data'
import { formatCurrency } from '@/utils/formatCurrency'

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
        <div
          className={`text-sm font-semibold flex items-center gap-1 ${
            isPositive ? 'text-success' : 'text-danger'
          }`}
        >
          <TrendingUp className='w-4 h-4' />
          {change}
        </div>
      </div>
    </CardBody>
  </Card>
)

export const AdminDashboardPage = () => {
  const [data, setData] = React.useState<{
    salesPerformanceData: IPaymentPerformance
    expensesPerformanceData: IExpensePerformance[]
  } | null>(null)
  const loadData = async () => {
    const response = await dashboardService.getStats({})
    if (!response) return

    setData({
      expensesPerformanceData: response.expenses,
      salesPerformanceData: response.payments,
    })
  }

  React.useEffect(() => {
    loadData()
  }, [])

  const categoryConfig = tableColumns.find((c) => c.uid === 'category')?.chipConfig || {}

  return (
    <div className='flex flex-col gap-3 min-h-screen'>
      <div className='flex items-center justify-between'>
        <Tabs variant='solid' aria-label='Dashboard views' color='primary' radius='full'>
          <Tab key='overview' title='Todo' />
          <Tab key='sales' title='Ventas' />
          <Tab key='expenses' title='Gastos' />
        </Tabs>
        <div className='items-center gap-3 sm:flex hidden'>
          <Select
            defaultSelectedKeys={['2weeks']}
            className='w-40'
            size='sm'
            variant='bordered'
            aria-label='Time range'
          >
            <SelectItem key='1week'>Ultima semana</SelectItem>
            <SelectItem key='2weeks'>Últimas 2 semanas</SelectItem>
            <SelectItem key='month'>Último mes</SelectItem>
            <SelectItem key='year'>Último año</SelectItem>
          </Select>
          <Button
            variant='flat'
            startContent={<Download className='w-4 h-4' />}
            className='text-default-700 font-medium'
          >
            Descargar
          </Button>
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
          label='Ventas'
          value={String(data?.salesPerformanceData.metrics.totalSales.count)}
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
                <h2 className='text-lg font-bold text-foreground mb-4'>Estadisticas de Ventas</h2>
                <div className='flex gap-8'>
                  <div>
                    <p className='text-sm text-default-500'>Ventas Semanales</p>
                    <p className='text-2xl font-bold text-foreground'>
                      {formatCurrency(
                        Number(data?.salesPerformanceData.metrics.weeklySales.amount),
                      )}
                    </p>
                    <p className='text-xs text-success mt-1'>
                      {data?.salesPerformanceData.metrics.weeklySales.percentage} %
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-default-500'>Ventas Diarias</p>
                    <p className='text-2xl font-bold text-foreground'>
                      {formatCurrency(Number(data?.salesPerformanceData.metrics.dailySales.amount))}
                    </p>
                    <p className='text-xs text-success mt-1'>
                      {data?.salesPerformanceData.metrics.dailySales.percentage} %
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-default-500'>Ventas Totales</p>
                    <p className='text-2xl font-bold text-foreground'>
                      {data?.salesPerformanceData.metrics.totalSales.count}
                    </p>
                    <p className='text-xs text-success mt-1'>
                      {data?.salesPerformanceData.metrics.totalSales.percentage}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Select
                  defaultSelectedKeys={['2weeks']}
                  size='sm'
                  variant='bordered'
                  aria-label='Filter range'
                >
                  <SelectItem key='1week'>Ultima semana</SelectItem>
                  <SelectItem key='2weeks'>Últimas 2 semanas</SelectItem>
                  <SelectItem key='month'>Último mes</SelectItem>
                  <SelectItem key='year'>Último año</SelectItem>
                </Select>
              </div>
            </div>
            <div className='h-[250px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={data?.salesPerformanceData.salesPerformanceData}>
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
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold text-foreground'>Gastos</h2>
              <Button isIconOnly variant='light' radius='full' size='sm'>
                <MoreVertical className='w-5 h-5 text-default-500' />
              </Button>
            </div>
            <div className='flex flex-wrap gap-4 mb-6'>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <div key={key} className='flex items-center gap-2'>
                  {/* Círculo de color dinámico usando el color del enum */}
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: config.color }}
                  ></div>
                  <span className='text-sm text-default-500'>{config.label}</span>
                </div>
              ))}
            </div>
            <div className='h-[250px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={data?.expensesPerformanceData}>
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
    </div>
  )
}
