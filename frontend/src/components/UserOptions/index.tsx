import { logOut } from '@/utils/logOut'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { Avatar, Dropdown, DropdownMenu, DropdownItem, DropdownTrigger, Link } from '@heroui/react'

export const NavbarUserOptions = () => {
  const user = useSelector((state: RootState) => state.user)

  const location = useLocation()
  const isInAdmin = location.pathname.includes('/admin')

  if (user) {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Avatar as='button' size='sm' color='primary' className='transition-transform' />
        </DropdownTrigger>
        <DropdownMenu aria-label='Profile Actions' variant='flat'>
          <DropdownItem key='profile' className='h-14 gap-2 default-text-color'>
            <p className='font-semibold'>Registrado como</p>
            <p className='font-semibold'>{user?.email || 'Usuario'}</p>
          </DropdownItem>
          {user && !isInAdmin ? (
            <>
              <DropdownItem key='dashboard'>
                <Link href='/admin/dashboard' target='_blank' className='flex gap-2'>
                  Dashboard
                  <ExternalLink size={15} />
                </Link>
              </DropdownItem>
            </>
          ) : (
            <></>
          )}
          <DropdownItem
            key='logout'
            className='text-danger'
            color='danger'
            onClick={() => logOut()}
          >
            Cerrar sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  } else {
    return (
      <Avatar as='button' size='sm' color='primary' className='transition-transform' isBordered />
    )
  }
}
