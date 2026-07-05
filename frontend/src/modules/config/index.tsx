import React from 'react'
import { SecurityForm } from './components/SecurityForm'
import { ProfileSidebar } from './components/ProfileSidebar'
import { Card, CardBody } from '@heroui/react'
import { UserPageLayout } from '@/layout/UserPageLayout'
import { PersonalInfoForm } from './components/PersonalInfoForm'

export const ConfigPage = () => {
  const [activeSection, setActiveSection] = React.useState('personal')

  return (
    <UserPageLayout>
      <div className='flex flex-col md:flex-row gap-4'>
        <ProfileSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <Card shadow='none' className='w-full p-6 md:p-8 relative'>
          <CardBody className='p-0 overflow-visible'>
            {activeSection === 'personal' ? <PersonalInfoForm /> : <SecurityForm />}
          </CardBody>
        </Card>
      </div>
    </UserPageLayout>
  )
}
