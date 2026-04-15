import React from 'react'
import toast from 'react-hot-toast'
import { Or } from '@/modules/auth/components/Or'
import { AuthForm } from '@/modules/auth/components/AuthInputForm'
import { AuthBody } from '@/modules/auth/components/AuthBody'
import { AuthFooter } from '@/modules/auth/components/AuthFooter'
import { AuthHeader } from '@/modules/auth/components/AuthHeader'
import { AuthSubmit } from '@/modules/auth/components/AuthSubmit'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/modules/auth/services'
import { AuthLoginOptions } from '@/modules/auth/components/AuthLoginOptions'
import { ContinueWithGoogle } from '@/modules/auth/components/ContinueWithGoogle'
import type { IAuthLoginUser } from '@/modules/auth/services/interfaces'
import { useDispatch } from 'react-redux'
import { setMyUser } from '@/features/userSlice'

export const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [data, setData] = React.useState<IAuthLoginUser>({
    email: '',
    password: '',
  })

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({
    email: '',
    password: '',
  })

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
      placeholder: 'Ingresa tu nombre de usuario',
    },
    {
      label: 'Contraseña',
      name: 'password',
      type: 'password',
      placeholder: 'Ingresa tu contraseña',
    },
  ]

  const handleValidation = (name: string, value: string) => {
    let newErrors = { ...errors }

    switch (name) {
      case 'username':
        if (value.trim() === '') {
          newErrors['username'] = 'Por favor, ingresa tu nombre de usuario.'
        } else {
          newErrors['username'] = ''
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (data.email.trim() === '' || data.password.trim() === '') {
      setErrors({
        username: data.email.trim() === '' ? 'Por favor, ingresa tu nombre de usuario.' : '',
        password: data.password.trim() === '' ? 'Por favor, ingresa tu contraseña.' : '',
      })
      return
    }

    try {
      const response = await authService.login(data)
      const { user } = response.data
      dispatch(setMyUser(user))
      navigate('/')
    } catch (error) {
      toast.error('Usuario o contraseña incorrecto.')
    }
  }

  return (
    <AuthBody onSubmit={handleLogin}>
      <AuthHeader title='¡Hola! Bienvenido' description='' />
      <AuthForm inputs={loginInputs} handleChange={handleChange} errors={errors} />
      <AuthLoginOptions />
      <AuthSubmit label='Iniciar sesión' />
      <Or />
      <ContinueWithGoogle />
      <AuthFooter href='/register/' label='¿No estás registrado aún?' hrefLabel='Crea una cuenta' />
    </AuthBody>
  )
}
