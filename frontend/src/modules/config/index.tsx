import React from 'react'
import { SecurityForm } from './components/SecurityForm'
import { ProfileSidebar } from './components/ProfileSidebar'
import { Card, CardBody } from '@heroui/react'
import { PersonalInfoForm } from './components/PersonalInfoForm'

export const ConfigPage = () => {
  const [activeSection, setActiveSection] = React.useState('personal')

  return (
    <div className='min-h-screen bg-background text-foreground flex justify-center'>
      <div className='w-full max-w-4xl px-6 py-6 flex flex-col md:flex-row gap-7'>
        <ProfileSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <Card
          shadow='none'
          className='flex-1 w-full border border-border/50 p-6 md:p-8 min-h-[460px]'
        >
          <CardBody className='p-0 overflow-visible'>
            {activeSection === 'personal' ? <PersonalInfoForm /> : <SecurityForm />}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
