import { Avatar } from '@heroui/react'
import { useState, useEffect, useRef } from 'react'
import {
  Badge,
  Bell,
  Building,
  CreditCard,
  LogOut,
  Plus,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Loader2,
  Lock,
  User,
  Phone,
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { getFormattedDateTime } from '@/utils/getFormattedDateTime'
import { userService } from '@/services/user'
import { fileService } from '@/services/file'
import { setMyUser, clearUser } from '@/features/userSlice'
import { logOut } from '@/utils/logOut'
import toast from 'react-hot-toast'

interface Country {
  code: string
  name: string
  prefix: string
}

const countries: Country[] = [
  { code: 'DE', name: 'Alemania', prefix: '+49' },
  { code: 'SA', name: 'Arabia Saudita', prefix: '+966' },
  { code: 'AR', name: 'Argentina', prefix: '+54' },
  { code: 'BO', name: 'Bolivia', prefix: '+591' },
  { code: 'BR', name: 'Brasil', prefix: '+55' },
  { code: 'CL', name: 'Chile', prefix: '+56' },
  { code: 'CN', name: 'China', prefix: '+86' },
  { code: 'CO', name: 'Colombia', prefix: '+57' },
  { code: 'CR', name: 'Costa Rica', prefix: '+506' },
  { code: 'CU', name: 'Cuba', prefix: '+53' },
  { code: 'EC', name: 'Ecuador', prefix: '+593' },
  { code: 'EG', name: 'Egipto', prefix: '+20' },
  { code: 'SV', name: 'El Salvador', prefix: '+503' },
  { code: 'AE', name: 'Emiratos Árabes Unidos', prefix: '+971' },
  { code: 'ES', name: 'España', prefix: '+34' },
  { code: 'US', name: 'Estados Unidos', prefix: '+1' },
  { code: 'FR', name: 'Francia', prefix: '+33' },
  { code: 'GT', name: 'Guatemala', prefix: '+502' },
  { code: 'HN', name: 'Honduras', prefix: '+504' },
  { code: 'IN', name: 'India', prefix: '+91' },
  { code: 'IT', name: 'Italia', prefix: '+39' },
  { code: 'JP', name: 'Japón', prefix: '+81' },
  { code: 'MX', name: 'México', prefix: '+52' },
  { code: 'NI', name: 'Nicaragua', prefix: '+505' },
  { code: 'PA', name: 'Panamá', prefix: '+507' },
  { code: 'PY', name: 'Paraguay', prefix: '+595' },
  { code: 'PE', name: 'Perú', prefix: '+51' },
  { code: 'PT', name: 'Portugal', prefix: '+351' },
  { code: 'GB', name: 'Reino Unido', prefix: '+44' },
  { code: 'DO', name: 'República Dominicana', prefix: '+1-809' },
  { code: 'RU', name: 'Rusia', prefix: '+7' },
  { code: 'ZA', name: 'Sudáfrica', prefix: '+27' },
  { code: 'UY', name: 'Uruguay', prefix: '+598' },
  { code: 'VE', name: 'Venezuela', prefix: '+58' },
].sort((a, b) => a.name.localeCompare(b.name))

export const ConfigPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  
  const [activeSection, setActiveSection] = useState('personal')
  
  // Personal Info Form State
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('+58')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Custom Dropdown State for Phone Prefix
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Avatar Upload State
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  
  // Eye toggle states
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  // Initialize form fields with Redux user info
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setLastName(user.lastName || '')
      // Parse stored phone: e.g. "+58 4121234567" → prefix=+58, number=4121234567
      const stored = user.phone || ''
      const match = stored.match(/^(\+\d+(?:-\d+)?)\s?(.*)$/)
      if (match) {
        setPhonePrefix(match[1])
        setPhoneNumber(match[2])
      } else {
        setPhonePrefix('+58')
        setPhoneNumber(stored)
      }
    }
  }, [user])

  const currentCountry = countries.find((c) => c.prefix === phonePrefix) || 
    (phonePrefix.startsWith('+1') ? countries.find(c => c.code === 'US') : countries.find(c => c.code === 'VE')) || 
    countries[0]

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.prefix.includes(searchQuery)
  )

  const hasChanges = 
    name.trim() !== (user?.name || '') ||
    lastName.trim() !== (user?.lastName || '') ||
    (phoneNumber.trim() ? `${phonePrefix} ${phoneNumber.trim()}` : '') !== (user?.phone || '')

  const sections = [
    { id: 'personal', icon: Building, label: 'Información personal' },
    { id: 'notifs', icon: Bell, label: 'Notificaciones' },
    { id: 'payment', icon: CreditCard, label: 'Métodos de pago' },
    { id: 'security', icon: Shield, label: 'Seguridad' },
  ]

  // Handler for Profile Info Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }
    if (!lastName.trim()) {
      toast.error('El apellido es obligatorio')
      return
    }

    setIsSavingProfile(true)
    const composedPhone = phoneNumber.trim()
      ? `${phonePrefix} ${phoneNumber.trim()}`
      : undefined
    try {
      const updatedUser = await userService.updateMyProfile({
        name: name.trim(),
        lastName: lastName.trim(),
        phone: composedPhone,
      })
      if (updatedUser) {
        dispatch(setMyUser(updatedUser))
        toast.success('Información personal actualizada correctamente')
      } else {
        toast.error('Error al actualizar la información')
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Error al guardar los cambios')
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Handler for Avatar Change
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // MIME type validation
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida')
      return
    }

    // Size validation (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 2MB')
      return
    }

    // Create local object URL for instant visual feedback
    const localUrl = URL.createObjectURL(file)
    setAvatarPreview(localUrl)
    setIsUploadingAvatar(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Upload file to get URL
      const uploadRes = await fileService.upload(formData)
      
      // Update profile with the new avatar URL
      const updatedUser = await userService.updateMyProfile({
        avatar: uploadRes.fileUrl,
      })

      if (updatedUser) {
        dispatch(setMyUser(updatedUser))
        toast.success('Foto de perfil actualizada correctamente')
      } else {
        toast.error('Error al actualizar la foto de perfil')
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      toast.error(error.message || 'Error al subir la imagen')
      setAvatarPreview(null) // Revert on failure
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Helper for password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-muted', textColor: 'text-muted-foreground' }
    if (pass.length < 8) return { score: 1, label: 'Muy corta (min. 8 caracteres)', color: 'bg-red-500 w-1/3', textColor: 'text-red-500' }
    
    const hasUpper = /[A-Z]/.test(pass)
    const hasLower = /[a-z]/.test(pass)
    const hasNumber = /[0-9]/.test(pass)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    
    const criteriaCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length
    
    if (criteriaCount >= 4) {
      return { score: 3, label: 'Fuerte y segura', color: 'bg-green-500 w-full', textColor: 'text-green-500' }
    } else if (criteriaCount >= 2) {
      return { score: 2, label: 'Media (añade mayúsculas o números)', color: 'bg-yellow-500 w-2/3', textColor: 'text-yellow-600' }
    } else {
      return { score: 1, label: 'Débil', color: 'bg-red-500 w-1/3', textColor: 'text-red-500' }
    }
  }

  const passStrength = getPasswordStrength(newPassword)

  // Handler for Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error('La contraseña actual es obligatoria')
      return
    }

    if (newPassword.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }

    // Match backend regex requirement: at least 1 uppercase, 1 lowercase, 1 number
    const passRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/
    if (!passRegex.test(newPassword)) {
      toast.error('La contraseña debe incluir al menos una mayúscula, una minúscula y un número')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    setIsChangingPassword(true)
    try {
      const success = await userService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })

      if (success) {
        toast.success('Contraseña actualizada correctamente')
        // Clear fields
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error('Error al actualizar la contraseña')
      }
    } catch (error: any) {
      console.error('Error changing password:', error)
      toast.error(error.message || 'Error al actualizar la contraseña')
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Handler for Log Out
  const handleLogoutClick = async () => {
    dispatch(clearUser())
    await logOut()
  }

  return (
    <div className='min-h-screen bg-background text-foreground transition-colors duration-200'>
      <div className='max-w-4xl mx-auto px-6 py-9'>
        <h1 className='text-3xl font-extrabold mb-7 tracking-tight'>Ajustes de cuenta</h1>
        
        <div className='flex flex-col md:flex-row gap-8'>
          {/* Profile Sidebar */}
          <aside className='w-full md:w-56 shrink-0'>
            <div className='text-center mb-7 bg-card border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden group'>
              {/* Profile Avatar Container with interactive Hover Effect */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className='relative w-24 h-24 rounded-full mx-auto mb-4 cursor-pointer overflow-hidden ring-4 ring-border hover:ring-[#2B4FFF] transition-all duration-300 group/avatar shadow-md'
              >
                <Avatar 
                  src={avatarPreview || user?.avatar || undefined} 
                  name={`${user?.name} ${user?.lastName}`}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110' 
                />
                <div className='absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300'>
                  <Camera size={20} className='text-white mb-0.5' />
                  <span className='text-[10px] text-white font-medium uppercase tracking-wider'>Cambiar</span>
                </div>
                {isUploadingAvatar && (
                  <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
                    <Loader2 className='text-white animate-spin' size={24} />
                  </div>
                )}
              </div>

              <input 
                type='file' 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept='image/*' 
                className='hidden' 
              />

              {(avatarPreview || user?.avatar) && (
                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation()
                    setIsUploadingAvatar(true)
                    try {
                      const updatedUser = await userService.updateMyProfile({
                        avatar: '',
                      })
                      if (updatedUser) {
                        dispatch(setMyUser(updatedUser))
                        setAvatarPreview(null)
                        toast.success('Foto de perfil eliminada correctamente')
                      }
                    } catch (error: any) {
                      toast.error('Error al eliminar la foto')
                    } finally {
                      setIsUploadingAvatar(false)
                    }
                  }}
                  disabled={isUploadingAvatar}
                  className="text-xs text-red-500 hover:text-red-600 mb-4 font-medium transition-colors"
                >
                  Eliminar foto
                </button>
              )}

              <div className='font-bold text-lg truncate'>
                {user?.name} {user?.lastName}
              </div>
              <div className='text-xs text-muted-foreground mt-0.5'>
                {user?.email}
              </div>
              
              <div className='text-[11px] font-semibold tracking-wider text-muted-foreground mt-3 bg-muted px-2 py-1 rounded-full inline-block uppercase'>
                {user?.role}
              </div>

              <div className='text-[10px] text-muted-foreground mt-3 pt-3 border-t border-border/60'>
                Miembro desde {getFormattedDateTime({ value: user?.createdAt })}
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className='space-y-1 bg-card border border-border rounded-2xl p-2 shadow-sm'>
              {sections.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeSection === id 
                      ? 'bg-[#2B4FFF] text-white shadow-md shadow-[#2B4FFF]/20' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
              
              <div className='pt-2 mt-2 border-t border-border/60'>
                <button 
                  onClick={handleLogoutClick}
                  className='w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200'
                >
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            </nav>
          </aside>

          {/* Content Panel */}
          <div className='flex-1 bg-card border border-border rounded-2xl p-7 shadow-sm transition-all duration-300'>
            
            {/* PERSONAL INFO SECTION */}
            {activeSection === 'personal' && (
              <form onSubmit={handleSaveProfile} className='space-y-6 animate-fadeIn'>
                <div>
                  <h2 className='text-xl font-bold tracking-tight'>Información personal</h2>
                  <p className='text-xs text-muted-foreground mt-1'>Actualiza tus datos de contacto e identificación.</p>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  {/* Name field */}
                  <div className='space-y-1.5'>
                    <label className='text-xs text-muted-foreground font-semibold uppercase tracking-wider block'>Nombre</label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/75'>
                        <User size={16} />
                      </div>
                      <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Nombre'
                        className='w-full pl-10 pr-3.5 py-3 border border-border rounded-xl text-sm bg-background/50 outline-none focus:border-[#2B4FFF] focus:ring-2 focus:ring-[#2B4FFF]/10 focus:bg-background transition-all duration-200'
                        required
                      />
                    </div>
                  </div>

                  {/* Last name field */}
                  <div className='space-y-1.5'>
                    <label className='text-xs text-muted-foreground font-semibold uppercase tracking-wider block'>Apellido</label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/75'>
                        <User size={16} />
                      </div>
                      <input
                        type='text'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder='Apellido'
                        className='w-full pl-10 pr-3.5 py-3 border border-border rounded-xl text-sm bg-background/50 outline-none focus:border-[#2B4FFF] focus:ring-2 focus:ring-[#2B4FFF]/10 focus:bg-background transition-all duration-200'
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email field (Disabled/Display-only) */}
                <div className='space-y-1.5'>
                  <label className='text-xs text-muted-foreground font-semibold uppercase tracking-wider block'>Correo electrónico</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/40'>
                      <Building size={16} />
                    </div>
                    <input
                      type='email'
                      value={user?.email || ''}
                      disabled
                      className='w-full pl-10 pr-3.5 py-3 border border-border/60 rounded-xl text-sm bg-muted/50 text-muted-foreground/80 outline-none cursor-not-allowed font-medium'
                    />
                  </div>
                  <p className='text-[10px] text-muted-foreground/70'>El correo electrónico no puede ser modificado por seguridad.</p>
                </div>

                {/* Phone field — prefix + number */}
                <div className='space-y-1.5'>
                  <label className='text-xs text-muted-foreground font-semibold uppercase tracking-wider block'>
                    Teléfono
                  </label>
                   <div className='flex gap-2'>
                    {/* Country prefix selector */}
                    <div className='relative shrink-0' ref={dropdownRef}>
                      <button
                        type='button'
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className='flex items-center gap-2 pl-3.5 pr-8 py-3 border border-border rounded-xl text-sm bg-background/50 hover:bg-background/80 outline-none focus:border-[#2B4FFF] focus:ring-2 focus:ring-[#2B4FFF]/10 transition-all duration-200 cursor-pointer min-w-[110px] h-[46px] justify-between shadow-sm relative'
                      >
                        <div className='flex items-center gap-2'>
                          <img
                            src={`https://flagcdn.com/w40/${currentCountry.code.toLowerCase()}.png`}
                            className='w-5 h-3.5 object-cover rounded-sm shadow-sm shrink-0'
                            alt={currentCountry.name}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <span className='font-semibold text-foreground text-xs'>{currentCountry.prefix}</span>
                        </div>
                        {/* Custom dropdown arrow */}
                        <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground/60'>
                          <svg 
                            width='10' 
                            height='6' 
                            viewBox='0 0 10 6' 
                            fill='currentColor'
                            className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                          >
                            <path d='M1 1l4 4 4-4'/>
                          </svg>
                        </div>
                      </button>

                      {/* Custom Dropdown list */}
                      {dropdownOpen && (
                        <div className='absolute left-0 z-50 mt-1.5 w-64 max-h-72 overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-xl animate-fadeIn flex flex-col'>
                          {/* Search Input */}
                          <div className='p-2 border-b border-border bg-muted/20'>
                            <input
                              type='text'
                              placeholder='Buscar país...'
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className='w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-background/50 text-foreground outline-none focus:border-[#2B4FFF] focus:ring-1 focus:ring-[#2B4FFF]/10 transition-all duration-150'
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          
                          {/* Country list */}
                          <div className='overflow-y-auto flex-1 max-h-52 scrollbar-thin scrollbar-thumb-muted-foreground/20'>
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((c) => (
                                <button
                                  key={`${c.code}-${c.prefix}`}
                                  type='button'
                                  onClick={() => {
                                    setPhonePrefix(c.prefix)
                                    setDropdownOpen(false)
                                    setSearchQuery('')
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs hover:bg-muted/80 transition-colors duration-150 text-left ${
                                    phonePrefix === c.prefix ? 'bg-[#2B4FFF]/10 font-semibold text-[#2B4FFF]' : ''
                                  }`}
                                >
                                  <div className='flex items-center gap-2.5'>
                                    <img
                                      src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                                      className='w-5 h-3.5 object-cover rounded-sm shadow-sm'
                                      alt={c.name}
                                    />
                                    <span className='truncate max-w-[130px] font-medium text-foreground'>{c.name}</span>
                                  </div>
                                  <span className='text-muted-foreground font-mono text-[10px] pr-1'>{c.prefix}</span>
                                </button>
                              ))
                            ) : (
                              <div className='px-3 py-4 text-xs text-muted-foreground text-center'>
                                No se encontraron países
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone number input */}
                    <input
                      id='phone-number'
                      type='tel'
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9\s\-()]/g, ''))}
                      placeholder='Ej: 4121234567'
                      className='flex-1 px-3.5 py-3 border border-border rounded-xl text-sm bg-background/50 outline-none focus:border-[#2B4FFF] focus:ring-2 focus:ring-[#2B4FFF]/10 focus:bg-background transition-all duration-200 h-[46px]'
                    />
                  </div>
                  <p className='text-[10px] text-muted-foreground/70'>Selecciona el prefijo de tu país y escribe tu número sin el código.</p>
                </div>

                <div className='pt-2'>
                  <button
                    type='submit'
                    disabled={isSavingProfile || !hasChanges}
                    className={`w-full md:w-auto px-7 py-3 rounded-xl text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                      isSavingProfile || !hasChanges
                        ? 'bg-muted border border-border text-muted-foreground/45 cursor-not-allowed shadow-none'
                        : 'hover:shadow-xl active:scale-[0.98] cursor-pointer'
                    }`}
                    style={isSavingProfile || !hasChanges ? undefined : { background: '#2B4FFF' }}
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className='animate-spin' size={16} />
                        Guardando...
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* NOTIFICATIONS SECTION */}
            {activeSection === 'notifs' && (
              <div className='animate-fadeIn'>
                <div>
                  <h2 className='text-xl font-bold tracking-tight'>Preferencias de notificación</h2>
                  <p className='text-xs text-muted-foreground mt-1'>Controla qué correos y notificaciones deseas recibir.</p>
                </div>
                
                <div className='space-y-0 mt-5'>
                  {[
                    {
                      label: 'Confirmaciones de reserva',
                      desc: 'Recibe un correo al confirmar una reserva',
                      on: true,
                    },
                    {
                      label: 'Recordatorios de pago',
                      desc: 'Alertas 5 días antes del vencimiento',
                      on: true,
                    },
                    {
                      label: 'Novedades de la plataforma',
                      desc: 'Nuevos apartamentos y funciones',
                      on: false,
                    },
                    { label: 'Notificaciones push', desc: 'En tu navegador o celular', on: true },
                  ].map((n) => (
                    <div
                      key={n.label}
                      className='flex items-start justify-between py-4.5 border-b border-border/60 last:border-0'
                    >
                      <div>
                        <div className='text-sm font-bold'>{n.label}</div>
                        <div className='text-xs text-muted-foreground mt-0.5 leading-relaxed'>{n.desc}</div>
                      </div>
                      <button
                        type='button'
                        className={`w-11 h-6 rounded-full relative shrink-0 ml-4 transition-colors duration-200 ${n.on ? 'bg-[#2B4FFF]' : 'bg-muted border border-border'}`}
                      >
                        <div
                          className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-all duration-200 ${n.on ? 'right-0.5' : 'left-0.5'}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAYMENT METHODS SECTION */}
            {activeSection === 'payment' && (
              <div className='animate-fadeIn space-y-6'>
                <div>
                  <h2 className='text-xl font-bold tracking-tight'>Métodos de pago</h2>
                  <p className='text-xs text-muted-foreground mt-1'>Administra tus tarjetas registradas para pagos recurrentes.</p>
                </div>

                <div className='space-y-3'>
                  {[
                    { type: 'Visa', last4: '4231', exp: '09/27', primary: true },
                    { type: 'Mastercard', last4: '8812', exp: '03/26', primary: false },
                  ].map((c) => (
                    <div
                      key={c.last4}
                      className='flex items-center justify-between bg-muted/40 border border-border/50 rounded-2xl p-4.5 hover:bg-muted/65 transition-colors shadow-sm'
                    >
                      <div className='flex items-center gap-3.5'>
                        <div className='w-12 h-8.5 bg-background border border-border rounded-lg flex items-center justify-center text-xs font-black shadow-sm'>
                          {c.type.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className='text-sm font-bold'>
                            {c.type} •••• {c.last4}
                          </div>
                          <div className='text-xs text-muted-foreground mt-0.5'>Vence {c.exp}</div>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        {c.primary && (
                          <span className='px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#2B4FFF]/10 text-[#2B4FFF] rounded-full'>
                            Principal
                          </span>
                        )}
                        <button className='text-xs text-muted-foreground hover:text-red-500 font-semibold transition-colors duration-150'>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type='button'
                  className='flex items-center gap-2 text-sm font-bold hover:opacity-85 transition-opacity'
                  style={{ color: '#2B4FFF' }}
                >
                  <Plus size={16} /> Agregar método de pago
                </button>
              </div>
            )}

            {/* SECURITY & PASSWORD SECTION */}
            {activeSection === 'security' && (
              <form onSubmit={handleChangePassword} className='space-y-6 animate-fadeIn'>
                <div>
                  <h2 className='text-xl font-bold tracking-tight'>Seguridad de la cuenta</h2>
                  <p className='text-xs text-muted-foreground mt-1'>Cambia tu contraseña para mantener tu cuenta protegida.</p>
                </div>
                
                {/* Current password */}
                <div className='space-y-1.5'>
                  <label className='text-xs text-muted-foreground font-semibold uppercase tracking-wider block'>Contraseña actual</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/75'>
                      <Lock size={16} />
                    </div>
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder='••••••••'
                      className='w-full pl-10 pr-10 py-3 border border-border rounded-xl text-sm bg-background/50 outline-none focus:border-[#2B4FFF] focus:ring-2 focus:ring-[#2B4FFF]/10 focus:bg-background transition-all duration-200'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground/60 hover:text-foreground transition-colors'
                    >
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div className='space-y-1.5'>
                  <label className='text-xs text-muted-foreground font-semibold uppercase tracking-wider block'>Nueva contraseña</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/75'>
                      <Lock size={16} />
                    </div>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder='Mínimo 8 caracteres'
                      className='w-full pl-10 pr-10 py-3 border border-border rounded-xl text-sm bg-background/50 outline-none focus:border-[#2B4FFF] focus:ring-2 focus:ring-[#2B4FFF]/10 focus:bg-background transition-all duration-200'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowNewPass(!showNewPass)}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground/60 hover:text-foreground transition-colors'
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Visual Meter */}
                  {newPassword && (
                    <div className='space-y-1.5 mt-2 animate-fadeIn'>
                      <div className='flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider'>
                        <span className='text-muted-foreground'>Fortaleza de contraseña:</span>
                        <span className={passStrength.textColor}>{passStrength.label}</span>
                      </div>
                      <div className='h-1.5 w-full bg-muted rounded-full overflow-hidden'>
                        <div className={`h-full rounded-full transition-all duration-300 ${passStrength.color}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm new password */}
                <div className='space-y-1.5'>
                  <label className='text-xs text-muted-foreground font-semibold uppercase tracking-wider block'>Confirmar nueva contraseña</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground/75'>
                      <Lock size={16} />
                    </div>
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder='Confirma tu nueva contraseña'
                      className='w-full pl-10 pr-10 py-3 border border-border rounded-xl text-sm bg-background/50 outline-none focus:border-[#2B4FFF] focus:ring-2 focus:ring-[#2B4FFF]/10 focus:bg-background transition-all duration-200'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground/60 hover:text-foreground transition-colors'
                    >
                      {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className='text-[10px] font-bold text-red-500 mt-1 animate-fadeIn'>Las contraseñas no coinciden.</p>
                  )}
                </div>

                <div className='pt-2'>
                  <button
                    type='submit'
                    disabled={isChangingPassword || !newPassword || newPassword !== confirmPassword}
                    className='w-full md:w-auto px-7 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    style={{ background: '#2B4FFF' }}
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className='animate-spin' size={16} />
                        Actualizando...
                      </>
                    ) : (
                      'Actualizar contraseña'
                    )}
                  </button>
                </div>

                <div className='border-t border-border/60 pt-6 mt-6'>
                  <h3 className='text-sm font-bold mb-1'>Autenticación de dos factores (2FA)</h3>
                  <p className='text-xs text-muted-foreground mb-4 leading-relaxed'>
                    Añade una capa extra de seguridad a tu cuenta requiriendo un código de verificación además de tu contraseña.
                  </p>
                  <button 
                    type='button'
                    className='text-xs border border-border rounded-xl px-4.5 py-2.5 hover:bg-muted font-bold transition-all active:scale-[0.98]'
                  >
                    Activar 2FA
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
