import { logOut } from '@/utils/logOut'
import { UserRole } from '@/models/UserModel'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { CalendarDays, Cog, DoorOpen, ShieldAlert } from 'lucide-react'
import {
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
  DropdownSection,
} from '@heroui/react'

export const NavbarUserOptions = () => {
  const user = useSelector((state: RootState) => state.user)
  const location = useLocation()
  const navigate = useNavigate()

  if (!user) {
    return <Avatar as='button' size='sm' color='primary' isBordered />
  }

  const isRoute = (path: string) => location.pathname === path

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar
          as='button'
          size='sm'
          color='primary'
          className='transition-transform'
          src={user.avatar}
        />
      </DropdownTrigger>

      <DropdownMenu aria-label='Acciones de Perfil' variant='flat'>
        <DropdownSection showDivider aria-label='Información de cuenta'>
          <DropdownItem key={'user'} isReadOnly className='h-16 gap-3'>
            <div className='flex items-center gap-3'>
              <Avatar size='sm' src={user.avatar} />
              <div className='flex flex-col'>
                <p className='font-semibold text-sm'>
                  {`${user.name} ${user.lastName}` || 'Usuario'}
                </p>
                <p className='text-xs text-default-400 truncate max-w-[150px]'>{user.email}</p>
              </div>
            </div>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title='Mi Cuenta' showDivider>
          <DropdownItem
            key='my-reservations'
            startContent={<CalendarDays size={15} />}
            isDisabled={isRoute('/reservations')}
            className={isRoute('/reservations') ? 'opacity-50 cursor-not-allowed' : ''}
            onPress={() => {
              if (!isRoute('/reservations')) {
                navigate('/reservations')
              }
            }}
          >
            Mis reservas
          </DropdownItem>
          <DropdownItem
            key='settings'
            startContent={<Cog size={15} />}
            isDisabled={isRoute('/config')}
            className={isRoute('/config') ? 'opacity-50 cursor-not-allowed' : ''}
            onPress={() => {
              if (!isRoute('/config')) {
                navigate('/config')
              }
            }}
          >
            Configuración
          </DropdownItem>
        </DropdownSection>
        <>
          {user.role === UserRole.ADMIN && (
            <DropdownSection title='Administración' showDivider>
              <DropdownItem
                key='admin-dashboard'
                startContent={<ShieldAlert size={15} />}
                isDisabled={isRoute('/admin/dashboard')}
                className={isRoute('/admin/dashboard') ? 'opacity-50 cursor-not-allowed' : ''}
                onPress={() => {
                  if (!isRoute('/admin')) {
                    navigate('/admin/dashboard')
                  }
                }}
              >
                Dashboard
              </DropdownItem>
            </DropdownSection>
          )}
        </>
        <DropdownSection>
          <DropdownItem
            key='logout'
            className='text-danger'
            color='danger'
            startContent={<DoorOpen size={15} />}
            onPress={logOut}
          >
            Cerrar sesión
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
