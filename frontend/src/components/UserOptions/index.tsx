import { logOut } from '@/utils/logOut'
import { UserRole } from '@/models/UserModel'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { ExternalLink, Cog, DoorOpen } from 'lucide-react'
import { Avatar, Dropdown, DropdownMenu, DropdownItem, DropdownTrigger } from '@heroui/react'

export const NavbarUserOptions = () => {
  const user = useSelector((state: RootState) => state.user)
  const location = useLocation()
  const isInAdmin = location.pathname.includes('/admin')
  const navigate = useNavigate()

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
          {user.role === UserRole.ADMIN && !isInAdmin ? (
            <>
              <DropdownItem
                key='dashboard'
                startContent={<ExternalLink size={15} />}
                onPress={() => navigate('/admin/dashboard')}
              >
                Dashboard
              </DropdownItem>
            </>
          ) : (
            <></>
          )}
          <DropdownItem
            key='dashboard'
            startContent={<Cog size={15} />}
            onPress={() => navigate('/config')}
          >
            Confuguración
          </DropdownItem>
          <DropdownItem
            key='logout'
            className='text-danger'
            color='danger'
            startContent={<DoorOpen size={15} />}
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
