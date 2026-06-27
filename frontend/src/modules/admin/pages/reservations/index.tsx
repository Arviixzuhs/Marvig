import React from 'react'
import { Tab, Tabs } from '@heroui/react'
import { ReservationGanttView } from './components/ReservationGanttView'
import { ReservationTableView } from './components/ReservationTableView'
import { Calendar, TableProperties } from 'lucide-react'

export const AdminReservationPage = () => {
  const [activeTab, setActiveTab] = React.useState<string | number>('table')

  return (
    <div className='flex flex-col h-full w-full overflow-hidden gap-4'>
      <div className='flex-shrink-0'>
        <Tabs
          color='primary'
          radius='full'
          variant='light'
          aria-label='reservations views'
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
        >
          <Tab
            key='table'
            title={
              <div className='flex items-center gap-2'>
                <TableProperties size={18} />
                <span>Tabla</span>
              </div>
            }
          />
          <Tab
            key='gantt'
            title={
              <div className='flex items-center gap-2'>
                <Calendar size={18} />
                <span>Diagrama Gantt</span>
              </div>
            }
          />
        </Tabs>
      </div>
      <div className='flex-1 min-h-0 w-full overflow-hidden'>
        {activeTab === 'table' ? <ReservationTableView /> : <ReservationGanttView />}
      </div>
    </div>
  )
}
