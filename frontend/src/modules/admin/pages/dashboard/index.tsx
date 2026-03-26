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

const salesPerformanceData = [
  { name: '01', value: 28 },
  { name: '02', value: 60 },
  { name: '03', value: 20 },
  { name: '04', value: 45 },
  { name: '05', value: 25 },
  { name: '06', value: 18 },
  { name: '07', value: 32 },
  { name: '08', value: 15 },
  { name: '09', value: 38 },
  { name: '10', value: 50 },
  { name: '11', value: 35 },
  { name: '12', value: 40 },
]

const trafficSourceData = [
  { month: 'Jan', organic: 12000, paid: 8000 },
  { month: 'Feb', organic: 15000, paid: 10000 },
  { month: 'Mar', organic: 13000, paid: 9500 },
  { month: 'Apr', organic: 16000, paid: 11000 },
  { month: 'May', organic: 14000, paid: 10500 },
  { month: 'Jun', organic: 17000, paid: 12000 },
  { month: 'Jul', organic: 16000, paid: 11500 },
  { month: 'Aug', organic: 18000, paid: 13000 },
  { month: 'Sep', organic: 17000, paid: 12500 },
  { month: 'Oct', organic: 19000, paid: 14000 },
  { month: 'Nov', organic: 18000, paid: 13500 },
  { month: 'Dec', organic: 20000, paid: 15000 },
]

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
  return (
    <div className='flex flex-col gap-3 min-h-screen'>
      <div className='flex items-center justify-between'>
        <Tabs variant='solid' aria-label='Dashboard views' color='primary' radius='full'>
          <Tab key='overview' title='Overview' />
          <Tab key='sales' title='Sales' />
          <Tab key='expenses' title='Expenses' />
        </Tabs>
        <div className='items-center gap-3 sm:flex hidden'>
          <Select
            defaultSelectedKeys={['2weeks']}
            className='w-40'
            size='sm'
            variant='bordered'
            aria-label='Time range'
          >
            <SelectItem key='1week'>Last 1 week</SelectItem>
            <SelectItem key='2weeks'>Last 2 weeks</SelectItem>
            <SelectItem key='month'>Last month</SelectItem>
            <SelectItem key='year'>Last year</SelectItem>
          </Select>
          <Button
            variant='flat'
            startContent={<Download className='w-4 h-4' />}
            className='text-default-700 font-medium'
          >
            Download
          </Button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
        <StatCard label='Revenue' value='$228,441' change='3.3%' isPositive={true} />
        <StatCard label='Expenses' value='$25,108' change='3.3%' isPositive={false} />
        <StatCard label='Sales' value='458' change='3.3%' isPositive={true} />
        <StatCard label='Profit' value='$203,133' change='4.1%' isPositive={true} />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
        <Card shadow='none' className='lg:col-span-2'>
          <CardBody className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h2 className='text-lg font-bold text-foreground mb-4'>Sales Performance</h2>
                <div className='flex gap-8'>
                  <div>
                    <p className='text-sm text-default-500'>Weekly Sales</p>
                    <p className='text-2xl font-bold text-foreground'>$28,441</p>
                    <p className='text-xs text-success mt-1'>↑ 3.1%</p>
                  </div>
                  <div>
                    <p className='text-sm text-default-500'>Daily Sales</p>
                    <p className='text-2xl font-bold text-foreground'>$4,063</p>
                    <p className='text-xs text-success mt-1'>↑ 3.3%</p>
                  </div>
                  <div>
                    <p className='text-sm text-default-500'>Total Sales</p>
                    <p className='text-2xl font-bold text-foreground'>278</p>
                    <p className='text-xs text-success mt-1'>↑ 3.3%</p>
                  </div>
                </div>
              </div>
              <Select
                defaultSelectedKeys={['2weeks']}
                className='w-32'
                size='sm'
                variant='bordered'
                aria-label='Filter range'
              >
                <SelectItem key='1week'>Last 1 week</SelectItem>
                <SelectItem key='2weeks'>Last 2 weeks</SelectItem>
                <SelectItem key='month'>Last month</SelectItem>
              </Select>
            </div>
            <div className='h-[250px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={salesPerformanceData}>
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
              <h2 className='text-lg font-bold text-foreground'>Traffic Source</h2>
              <Button isIconOnly variant='light' radius='full' size='sm'>
                <MoreVertical className='w-5 h-5 text-default-500' />
              </Button>
            </div>
            <div className='flex gap-4 mb-6'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-primary rounded-full'></div>
                <span className='text-sm text-default-500'>Organic</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-primary-200 rounded-full'></div>
                <span className='text-sm text-default-500'>Paid Ads</span>
              </div>
            </div>
            <div className='h-[250px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={trafficSourceData}>
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
                  <Line
                    type='monotone'
                    dataKey='organic'
                    stroke='#006FEE'
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type='monotone'
                    dataKey='paid'
                    stroke='#93C5FD'
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
