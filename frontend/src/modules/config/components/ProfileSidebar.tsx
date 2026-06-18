import React from 'react'
import toast from 'react-hot-toast'
import { logOut } from '@/utils/logOut'
import { RootState } from '@/store'
import { setMyUser } from '@/features/userSlice'
import { userService } from '@/services/user'
import { fileService } from '@/services/file'
import { getFormattedDateTime } from '@/utils/getFormattedDateTime'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, Card, CardBody } from '@heroui/react'
import { Building, Camera, LogOut, Shield } from 'lucide-react'

interface ProfileSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export const ProfileSidebar = ({ activeSection, setActiveSection }: ProfileSidebarProps) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)

  const [isUploading, setIsUploading] = React.useState(false)
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarPreview(URL.createObjectURL(file))
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fileService.upload(formData)
      const updatedUser = await userService.updateMyProfile({ avatar: uploadRes.fileUrl })

      if (updatedUser) {
        dispatch(setMyUser(updatedUser))
        toast.success('Foto de perfil actualizada correctamente')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al subir la imagen')
      setAvatarPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteAvatar = async () => {
    setIsUploading(true)
    try {
      const updatedUser = await userService.updateMyProfile({ avatar: '' })
      if (updatedUser) {
        dispatch(setMyUser(updatedUser))
        setAvatarPreview(null)
        toast.success('Foto de perfil eliminada')
      }
    } catch {
      toast.error('Error al eliminar la foto')
    } finally {
      setIsUploading(false)
    }
  }

  const sections = [
    { id: 'personal', icon: Building, label: 'Información personal' },
    { id: 'security', icon: Shield, label: 'Seguridad' },
  ]

  return (
    <aside className='flex flex-col gap-4 w-full md:w-64 shrink-0'>
      <Card
        shadow='none'
        className='p-5 border border-border/50 text-center relative overflow-hidden'
      >
        <CardBody className='p-0 items-center justify-center'>
          <div
            onClick={() => fileInputRef.current?.click()}
            className='relative w-24 h-24 rounded-full mb-4 cursor-pointer overflow-hidden group/avatar shadow-sm border-2 border-border hover:border-primary transition-all duration-300'
          >
            <Avatar
              src={avatarPreview || user?.avatar || undefined}
              name={`${user?.name} ${user?.lastName}`}
              className='w-full h-full text-large'
              isBordered
            />
            <div className='absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 z-10'>
              <Camera size={18} className='text-white mb-0.5' />
              <span className='text-[10px] text-white font-semibold uppercase tracking-wider'>
                Cambiar
              </span>
            </div>
          </div>

          <input
            type='file'
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept='image/*'
            className='hidden'
          />

          {(avatarPreview || user?.avatar) && (
            <Button
              size='sm'
              variant='light'
              color='danger'
              onPress={handleDeleteAvatar}
              className='h-7 min-w-0 px-2 mb-4 text-xs font-semibold'
              isLoading={isUploading}
            >
              Eliminar foto
            </Button>
          )}

          <h3 className='font-bold text-lg truncate max-w-full'>
            {user?.name} {user?.lastName}
          </h3>
          <p className='text-xs text-muted-foreground mt-0.5 truncate max-w-full'>{user?.email}</p>
          <div className='text-[10px] font-bold tracking-wider text-muted-foreground mt-3 bg-muted px-2.5 py-1 rounded-full uppercase inline-block'>
            {user?.role}
          </div>
          <div className='text-[10px] text-muted-foreground mt-4 pt-4 border-t border-border/60 w-full'>
            Miembro desde {getFormattedDateTime({ value: user?.createdAt })}
          </div>
        </CardBody>
      </Card>

      <Card shadow='none' className='p-2 border border-border/50'>
        <nav className='flex flex-col gap-1'>
          {sections.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={activeSection === id ? 'solid' : 'light'}
              color={activeSection === id ? 'primary' : 'default'}
              className={`justify-start font-semibold text-sm h-11 px-4 ${activeSection === id ? 'shadow-md shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
              startContent={<Icon size={16} />}
              onPress={() => setActiveSection(id)}
            >
              {label}
            </Button>
          ))}
          <div className='pt-1.5 mt-1.5 border-t border-border/60'>
            <Button
              variant='light'
              color='danger'
              className='w-full justify-start font-semibold text-sm h-11 px-4'
              startContent={<LogOut size={16} />}
              onPress={logOut}
            >
              Cerrar sesión
            </Button>
          </div>
        </nav>
      </Card>
    </aside>
  )
}
