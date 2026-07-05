import React from 'react'
import toast from 'react-hot-toast'
import { RootState } from '@/store'
import { setMyUser } from '@/features/userSlice'
import { inputStyles } from '@/styles'
import { userService } from '@/services/user'
import { FormActions } from '@/components/FormActions'
import { Building, User } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from '@heroui/react'

const countries = [
  { code: 'DE', name: 'Alemania', prefix: '+49' },
  { code: 'AR', name: 'Argentina', prefix: '+54' },
  { code: 'BO', name: 'Bolivia', prefix: '+591' },
  { code: 'BR', name: 'Brasil', prefix: '+55' },
  { code: 'CL', name: 'Chile', prefix: '+56' },
  { code: 'CO', name: 'Colombia', prefix: '+57' },
  { code: 'CR', name: 'Costa Rica', prefix: '+506' },
  { code: 'CU', name: 'Cuba', prefix: '+53' },
  { code: 'EC', name: 'Ecuador', prefix: '+593' },
  { code: 'ES', name: 'España', prefix: '+34' },
  { code: 'US', name: 'Estados Unidos', prefix: '+1' },
  { code: 'MX', name: 'México', prefix: '+52' },
  { code: 'PA', name: 'Panamá', prefix: '+507' },
  { code: 'PE', name: 'Perú', prefix: '+51' },
  { code: 'VE', name: 'Venezuela', prefix: '+58' },
].sort((a, b) => a.name.localeCompare(b.name))

export const PersonalInfoForm = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)

  const [name, setName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)
  const [phonePrefix, setPhonePrefix] = React.useState('+58')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    if (user) {
      setName(user.name || '')
      setLastName(user.lastName || '')
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

  const currentCountry =
    countries.find((c) => c.prefix === phonePrefix) ||
    countries.find((c) => c.code === 'VE') ||
    countries[0]
  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.prefix.includes(searchQuery),
  )

  const hasChanges =
    name.trim() !== (user?.name || '') ||
    lastName.trim() !== (user?.lastName || '') ||
    (phoneNumber.trim() ? `${phonePrefix} ${phoneNumber.trim()}` : '') !== (user?.phone || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const composedPhone = phoneNumber.trim() ? `${phonePrefix} ${phoneNumber.trim()}` : undefined
    try {
      const updatedUser = await userService.updateMyProfile({
        name: name.trim(),
        lastName: lastName.trim(),
        phone: composedPhone,
      })
      if (updatedUser) {
        dispatch(setMyUser(updatedUser))
        toast.success('Información actualizada')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  const onCancelEdit = () => {
    setName(user?.name || '')
    setLastName(user?.lastName || '')

    const stored = user?.phone || ''
    const match = stored.match(/^(\+\d+(?:-\d+)?)\s?(.*)$/)

    if (match) {
      setPhonePrefix(match[1])
      setPhoneNumber(match[2])
    } else {
      setPhonePrefix('+58')
      setPhoneNumber(stored)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div>
        <h2 className='text-xl font-bold tracking-tight'>Información personal</h2>
        <p className='text-xs text-muted-foreground mt-1'>Actualiza tus datos de contacto.</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Input
          label='Nombre'
          placeholder='Tu nombre'
          value={name}
          onValueChange={setName}
          isRequired
          variant='bordered'
          startContent={<User size={16} className='text-muted-foreground/70' />}
          labelPlacement='outside'
          classNames={inputStyles}
        />
        <Input
          label='Apellido'
          placeholder='Tu apellido'
          value={lastName}
          onValueChange={setLastName}
          isRequired
          variant='bordered'
          startContent={<User size={16} className='text-muted-foreground/70' />}
          labelPlacement='outside'
          classNames={inputStyles}
        />
      </div>

      <Input
        label='Correo electrónico'
        value={user?.email || ''}
        isDisabled
        variant='bordered'
        startContent={<Building size={16} className='text-muted-foreground/40' />}
        labelPlacement='outside'
        classNames={inputStyles}
      />

      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-medium text-foreground'>Teléfono</label>
        <div className='flex gap-2 items-start'>
          <Dropdown placement='bottom-start' className='border border-border min-w-[260px]'>
            <DropdownTrigger>
              <Button variant='flat'>
                <img
                  src={`https://flagcdn.com/w40/${currentCountry.code.toLowerCase()}.png`}
                  className='w-5 h-3.5 object-cover rounded-sm shrink-0'
                  alt=''
                />
                <span>{currentCountry.prefix}</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label='Países'
              className='max-h-60 overflow-y-auto'
              disabledKeys={[phonePrefix]}
              topContent={
                <div className='sticky top-0 z-20'>
                  <Input
                    size='sm'
                    placeholder='Buscar...'
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    variant='flat'
                    isClearable
                  />
                </div>
              }
            >
              {filteredCountries.map((c) => (
                <DropdownItem
                  key={c.prefix}
                  onClick={() => {
                    setPhonePrefix(c.prefix)
                    setSearchQuery('')
                  }}
                  startContent={
                    <img
                      src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                      className='w-4 h-3 object-cover rounded-sm'
                      alt=''
                    />
                  }
                >
                  <span className='text-xs'>
                    {c.name} ({c.prefix})
                  </span>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Input
            type='tel'
            placeholder='Ej: 4121234567'
            value={phoneNumber}
            onValueChange={(val) => setPhoneNumber(val.replace(/[^0-9]/g, ''))}
            variant='bordered'
            classNames={inputStyles}
          />
        </div>
        <FormActions visible={hasChanges} isSaving={isSaving} onCancel={onCancelEdit} />
      </div>
    </form>
  )
}
