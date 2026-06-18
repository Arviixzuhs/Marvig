import { Button, Card, CardBody, Input, Progress } from '@heroui/react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { userService } from '@/services/user'
import toast from 'react-hot-toast'
import { inputStyles } from '@/styles'

export const SecurityForm = () => {
  const user = useSelector((state: RootState) => state.user)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChanging, setIsChanging] = useState(false)

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const passStrength = useMemo(() => {
    if (!newPassword)
      return { score: 0, label: '', color: 'default' as const, text: 'text-muted-foreground' }
    if (newPassword.length < 8)
      return { score: 25, label: 'Muy corta', color: 'danger' as const, text: 'text-danger' }
    const criteria = [/[A-Z]/, /[a-z]/, /[0-9]/, /[!@#$%^&*]/].filter((r) =>
      r.test(newPassword),
    ).length
    if (criteria >= 4)
      return { score: 100, label: 'Fuerte', color: 'success' as const, text: 'text-success' }
    if (criteria >= 2)
      return { score: 65, label: 'Media', color: 'warning' as const, text: 'text-warning' }
    return { score: 25, label: 'Débil', color: 'danger' as const, text: 'text-danger' }
  }, [newPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return toast.error('Las contraseñas no coinciden')

    setIsChanging(true)
    try {
      const success = await userService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })
      if (success) {
        toast.success('Contraseña actualizada')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar')
    } finally {
      setIsChanging(false)
    }
  }

  if (user?.hasPassword === false) {
    return (
      <Card
        shadow='none'
        className='border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-4'
      >
        <CardBody className='p-0 flex flex-row gap-4 items-start'>
          <div className='flex-1'>
            <h4 className='text-sm font-bold text-blue-900 dark:text-blue-100'>
              Cuenta vinculada con Google
            </h4>
            <p className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
              Inicias sesión usando tu cuenta de Google, por lo que no requieres contraseña local.
            </p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <Input
        label='Contraseña actual'
        placeholder='••••••••'
        value={currentPassword}
        onValueChange={setCurrentPassword}
        isRequired
        variant='bordered'
        labelPlacement='outside'
        classNames={inputStyles}
        startContent={<Lock size={16} className='text-muted-foreground/75' />}
        type={showCurrent ? 'text' : 'password'}
        endContent={
          <button
            type='button'
            onClick={() => setShowCurrent(!showCurrent)}
            className='focus:outline-none text-muted-foreground/60'
          >
            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      <div className='space-y-2'>
        <Input
          label='Nueva contraseña'
          placeholder='Mínimo 8 caracteres'
          value={newPassword}
          onValueChange={setNewPassword}
          isRequired
          variant='bordered'
          labelPlacement='outside'
          classNames={inputStyles}
          startContent={<Lock size={16} className='text-muted-foreground/75' />}
          type={showNew ? 'text' : 'password'}
          endContent={
            <button
              type='button'
              onClick={() => setShowNew(!showNew)}
              className='focus:outline-none text-muted-foreground/60'
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        {newPassword && (
          <div className='space-y-1 pt-1'>
            <div className='flex justify-between text-[10px] font-bold uppercase'>
              <span className='text-muted-foreground'>Fortaleza:</span>
              <span className={passStrength.text}>{passStrength.label}</span>
            </div>
            <Progress
              size='sm'
              value={passStrength.score}
              color={passStrength.color}
              className='max-w-md'
            />
          </div>
        )}
      </div>

      <Input
        label='Confirmar nueva contraseña'
        placeholder='Confirma tu contraseña'
        value={confirmPassword}
        onValueChange={setConfirmPassword}
        isRequired
        variant='bordered'
        labelPlacement='outside'
        classNames={inputStyles}
        startContent={<Lock size={16} className='text-muted-foreground/75' />}
        type={showConfirm ? 'text' : 'password'}
        isInvalid={confirmPassword !== '' && newPassword !== confirmPassword}
        errorMessage={
          confirmPassword && newPassword !== confirmPassword
            ? 'Las contraseñas no coinciden.'
            : undefined
        }
        endContent={
          <button
            type='button'
            onClick={() => setShowConfirm(!showConfirm)}
            className='focus:outline-none text-muted-foreground/60'
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      <Button
        type='submit'
        color='primary'
        isLoading={isChanging}
        isDisabled={!newPassword || newPassword !== confirmPassword}
      >
        Actualizar contraseña
      </Button>
    </form>
  )
}
