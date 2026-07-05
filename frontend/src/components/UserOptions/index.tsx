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
    return (
      <Avatar as='button' size='sm' color='primary' className='transition-transform' isBordered />
    )
  }

  const isAdminRoute = location.pathname.includes('/admin')
  const isConfigRoute = location.pathname.includes('/config')

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
          <DropdownItem key='profile-info' className='h-16 gap-3 default-text-color' isReadOnly>
            <div className='flex items-center gap-3'>
              <Avatar
                size='sm'
                color='primary'
                src={user.avatar}
                className='w-8 h-8 min-w-[32px]'
              />
              <div className='flex flex-col gap-0.5'>
                <div className='flex items-center gap-2'>
                  <p className='font-semibold text-sm text-default-800'>
                    {`${user.name} ${user.lastName}` || 'Usuario'}
                  </p>
                </div>
                <p className='text-xs text-default-400 font-normal truncate max-w-[150px]'>
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection title='Mi Cuenta' showDivider aria-label='Opciones de usuario'>
          <DropdownItem
            key='my-reservations'
            startContent={<CalendarDays size={15} />}
            onPress={() => navigate('/reservations')}
          >
            Mis reservas
          </DropdownItem>

          <>
            {!isConfigRoute && (
              <DropdownItem
                key='settings'
                startContent={<Cog size={15} />}
                onPress={() => navigate('/config')}
              >
                Configuración
              </DropdownItem>
            )}
          </>
        </DropdownSection>

        <>
          {user.role === UserRole.ADMIN && !isAdminRoute && (
            <DropdownSection title='Administración' showDivider aria-label='Opciones de admin'>
              <DropdownItem
                key='admin-dashboard'
                className='dark:text-warning'
                startContent={<ShieldAlert size={15} />}
                onPress={() => navigate('/admin/dashboard')}
              >
                Dashboard Admin
              </DropdownItem>
            </DropdownSection>
          )}
        </>

        <DropdownSection aria-label='Acciones de salida'>
          <DropdownItem
            key='logout'
            className='text-danger'
            color='danger'
            startContent={<DoorOpen size={15} />}
            onPress={() => logOut()}
          >
            Cerrar sesión
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
