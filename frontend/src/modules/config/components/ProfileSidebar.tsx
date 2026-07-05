import React from 'react'
import toast from 'react-hot-toast'
import { logOut } from '@/utils/logOut'
import { RootState } from '@/store'
import { setMyUser } from '@/features/userSlice'
import { userService } from '@/services/user'
import { fileService } from '@/services/file'
import { getFormattedDateTime } from '@/utils/getFormattedDateTime'
import { useDispatch, useSelector } from 'react-redux'
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { Building, Camera, LogOut, Shield, Trash2 } from 'lucide-react'

interface ProfileSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export const ProfileSidebar = ({ activeSection, setActiveSection }: ProfileSidebarProps) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)

  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarPreview(URL.createObjectURL(file))

    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fileService.upload(formData)
      const updatedUser = await userService.updateMyProfile({
        avatar: uploadRes.fileUrl,
      })

      if (updatedUser) {
        dispatch(setMyUser(updatedUser))
        toast.success('Foto de perfil actualizada correctamente')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al subir la imagen')
      setAvatarPreview(null)
    }
  }

  const handleDeleteAvatar = async () => {
    try {
      const updatedUser = await userService.updateMyProfile({
        avatar: '',
      })

      if (updatedUser) {
        dispatch(setMyUser(updatedUser))
        setAvatarPreview(null)
        toast.success('Foto de perfil eliminada')
      }
    } catch {
      toast.error('Error al eliminar la foto')
    }
  }

  const sections = [
    { id: 'personal', icon: Building, label: 'Información personal' },
    { id: 'security', icon: Shield, label: 'Seguridad' },
  ]

  return (
    <Card shadow='none' className='w-full md:w-80 shrink-0 bg-content1'>
      <CardBody className='p-6 flex flex-col gap-6'>
        {/* HEADER */}
        <div className='flex flex-col items-center gap-4 pb-6 border-b border-divider'>
          <Dropdown placement='bottom'>
            <DropdownTrigger>
              <div className='relative group cursor-pointer'>
                <div className='relative w-28 h-28 rounded-full overflow-hidden border-2 border-divider transition-all duration-300 group-hover:border-primary shadow-sm'>
                  <Avatar
                    src={avatarPreview || user?.avatar || undefined}
                    name={`${user?.name} ${user?.lastName}`}
                    className='w-full h-full text-2xl'
                  />

                  <div className='absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                    <Camera className='text-white' size={22} />
                  </div>
                </div>
              </div>
            </DropdownTrigger>

            <DropdownMenu aria-label='Avatar'>
              <DropdownItem
                key='change'
                startContent={<Camera size={16} />}
                onPress={() => fileInputRef.current?.click()}
              >
                Cambiar foto
              </DropdownItem>

              <>
                {(avatarPreview || user?.avatar) && (
                  <DropdownItem
                    key='delete'
                    color='danger'
                    startContent={<Trash2 size={16} />}
                    onPress={handleDeleteAvatar}
                  >
                    Eliminar foto
                  </DropdownItem>
                )}
              </>
            </DropdownMenu>
          </Dropdown>

          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleAvatarChange}
          />

          {/* INFO */}
          <div className='flex flex-col items-center gap-1'>
            <h2 className='text-lg font-semibold text-center'>
              {user?.name} {user?.lastName}
            </h2>

            <p className='text-sm text-default-500 text-center break-all'>{user?.email}</p>

            <span className='mt-2 rounded-full bg-default-100 px-3 py-1 text-xs font-medium uppercase tracking-wide'>
              {user?.role}
            </span>

            <p className='text-xs text-default-500 text-center mt-2'>
              Miembro desde {getFormattedDateTime({ value: user?.createdAt })}
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className='flex flex-col gap-2'>
          {sections.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              fullWidth
              radius='lg'
              variant={activeSection === id ? 'solid' : 'light'}
              color={activeSection === id ? 'primary' : 'default'}
              startContent={<Icon size={18} />}
              className='justify-start h-11 font-medium'
              onPress={() => setActiveSection(id)}
            >
              {label}
            </Button>
          ))}

          <div className='flex flex-col gap-2 pt-4 border-t border-divider'>
            <Button
              fullWidth
              radius='lg'
              variant='light'
              color='danger'
              startContent={<LogOut size={18} />}
              className='justify-start h-11 font-medium'
              onPress={logOut}
            >
              Cerrar sesión
            </Button>
          </div>
        </nav>
      </CardBody>
    </Card>
  )
}
