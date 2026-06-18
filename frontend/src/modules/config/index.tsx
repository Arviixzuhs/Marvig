import React from 'react'
import { SecurityForm } from './components/SecurityForm'
import { ProfileSidebar } from './components/ProfileSidebar'
import { Card, CardBody } from '@heroui/react'
import { PersonalInfoForm } from './components/PersonalInfoForm'

export const ConfigPage = () => {
  const [activeSection, setActiveSection] = React.useState('personal')

  return (
    <div className='bg-background text-foreground grid items-center p-4 transition-colors duration-200'>
      <div className='max-w-4xl w-full mx-auto flex flex-col md:flex-row gap-4 items-start'>
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
