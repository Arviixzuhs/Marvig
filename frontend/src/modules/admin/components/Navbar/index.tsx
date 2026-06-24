import { ThemeToggle } from './ThemeToggle'
import { ChatbotModal } from '@/components/ChatbotModal'
import { Notifications } from '@/components/Notifications'
import { NavbarUserOptions } from '@/components/UserOptions'
import { Navbar, NavbarContent, NavbarItem } from '@heroui/react'

export const AdminNavbar = () => {
  return (
    <Navbar maxWidth='full' className='z-30 h-16 bg-background/70 backdrop-blur-md'>
      <NavbarContent justify='start'>
        <NavbarItem className='flex gap-4 items-center justify-center'>
          <ChatbotModal />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end' className='gap-4'>
        <NavbarItem className='flex items-center gap-2'>
          <ThemeToggle />
          <Notifications />
        </NavbarItem>
        <NavbarItem>
          <NavbarUserOptions />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
