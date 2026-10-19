import React from 'react'
import { Or } from '@/modules/auth/components/Or'
import { AuthForm } from '@/modules/auth/components/AuthInputForm'
import { setMyUser } from '@/features/userSlice'
import { RootState } from '@/store'
import { AuthSubmit } from '@/modules/auth/components/AuthSubmit'
import { AuthFooter } from '@/modules/auth/components/AuthFooter'
import { authService } from '@/modules/auth/services'
import { setIsLoginModal } from '@/modules/auth/slice/authSlice'
import { ContinueWithGoogle } from '@/modules/auth/components/ContinueWithGoogle'
import type { IAuthLoginUser } from '@/modules/auth/services/interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react'

interface LoginModalProps {
  title?: string
}

export const LoginModal = ({ title = '¡Hola! Bienvenido' }: LoginModalProps) => {
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  const [data, setData] = React.useState<IAuthLoginUser>({
    email: '',
    password: '',
  })

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({
    email: '',
    password: '',
  })

  const onCloseModal = () => {
    dispatch(setIsLoginModal(false))
  }

  const handleValidation = (name: string, value: string) => {
    let newErrors = { ...errors }

    switch (name) {
      case 'email':
      case 'username':
        if (value.trim() === '') {
          newErrors['email'] = 'Por favor, ingresa tu correo electrónico.'
        } else {
          newErrors['email'] = ''
        }
        break
      case 'password':
        if (value.trim() === '') {
          newErrors['password'] = 'Por favor, ingresa tu contraseña.'
        } else {
          newErrors['password'] = ''
        }
        break
      default:
        break
    }
    setErrors(newErrors)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value,
    })

    handleValidation(name, value)
  }

  const loginInputs = [
    {
      label: 'Email',
      name: 'email',
      type: 'text',
      placeholder: 'Ingresa tu correo electrónico',
    },
    {
      label: 'Contraseña',
      name: 'password',
      type: 'password',
      placeholder: 'Ingresa tu contraseña',
    },
  ]

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (data.email.trim() === '' || data.password.trim() === '') {
      setErrors({
        email: data.email.trim() === '' ? 'Por favor, ingresa tu correo electrónico.' : '',
        password: data.password.trim() === '' ? 'Por favor, ingresa tu contraseña.' : '',
      })
      return
    }

    try {
      const response = await authService.login(data)
      const { user } = response.data
      dispatch(setMyUser(user))

      onCloseModal()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Modal
      isOpen={auth.isLoginModalOpen}
      onOpenChange={onCloseModal}
      placement='center'
      scrollBehavior='inside'
    >
      <ModalContent>
        {() => (
          <div className='flex flex-col gap-5'>
            <ModalHeader className='flex flex-col gap-1 pb-0'>
              <h2 className='text-xl font-bold text-center'>{title}</h2>
            </ModalHeader>

            <div>
              <ModalBody>
                <form onSubmit={handleLogin} className='flex flex-col gap-4'>
                  <AuthForm inputs={loginInputs} handleChange={handleChange} errors={errors} />
                  <AuthSubmit label='Iniciar sesión' />
                </form>
              </ModalBody>

              <ModalFooter className='flex flex-col gap-2 pt-0'>
                <Or />
                <ContinueWithGoogle navigateToHome={false} />
                <AuthFooter
                  href='/register/'
                  label='¿No estás registrado aún?'
                  hrefLabel='Crea una cuenta'
                />
              </ModalFooter>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}
