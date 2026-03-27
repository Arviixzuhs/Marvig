import { NavbarUserOptions } from '@/components/UserOptions'
import { Badge, Button, Navbar, NavbarContent, NavbarItem } from '@heroui/react'
import { Bell, Search } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export const AdminNavbar = () => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <Navbar maxWidth='full' className='z-30 h-16 bg-background/70 backdrop-blur-md'>
      <NavbarContent justify='start'>
        <NavbarItem>
          <h1 className='text-xl font-semibold text-foreground hidden lg:block'>
            Buenos días, <span className='text-primary'>{user?.name || 'Invitado'}</span>
          </h1>
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
          <Button variant='flat' className='font-medium hidden sm:flex'>
            Invitar
          </Button>
        </NavbarItem>
        <NavbarItem>
          <NavbarUserOptions />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
