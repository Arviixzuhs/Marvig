import { NavbarUserOptions } from '@/components/UserOptions'
import { Navbar, NavbarContent } from '@heroui/react'

export const AdminNavbar = () => {
  return (
    <Navbar maxWidth='full'>
      <NavbarContent as='div' className='items-center' justify='end'>
        <NavbarUserOptions />
      </NavbarContent>
    </Navbar>
  )
}
