import { Bell, Search } from 'lucide-react'
import { ChatbotModal } from '@/components/ChatbotModal'
import { NavbarUserOptions } from '@/components/UserOptions'
import { Badge, Button, Navbar, NavbarContent, NavbarItem } from '@heroui/react'

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
          <Button isIconOnly variant='light' radius='full'>
            <Search className='w-5 h-5 text-default-500' />
          </Button>
          <Badge content='3' color='danger' shape='circle' placement='top-right'>
            <Button isIconOnly variant='light' radius='full'>
              <Bell className='w-5 h-5 text-default-500' />
            </Button>
          </Badge>
        </NavbarItem>
        <NavbarItem>
          <NavbarUserOptions />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
