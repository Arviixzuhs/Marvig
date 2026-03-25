import React from 'react'
import { Or } from '@/modules/auth/components/Or'
import { AuthForm } from '@/modules/auth/components/AuthInputForm'
import { AuthBody } from '@/modules/auth/components/AuthBody'
import { AuthFooter } from '@/modules/auth/components/AuthFooter'
import { AuthHeader } from '@/modules/auth/components/AuthHeader'
import { AuthSubmit } from '@/modules/auth/components/AuthSubmit'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/modules/auth/services'
import { validatePassword } from '@/utils/validatePassword'
import { ContinueWithGoogle } from '@/modules/auth/components/ContinueWithGoogle'
import type { IAuthRegisterUser } from '@/modules/auth/services/interfaces'

export const RegisterPage = () => {
  const navigate = useNavigate()

  const [data, setData] = React.useState<IAuthRegisterUser>({
    email: '',
    password: '',
    lastName: '',
    firstName: '',
    repeatPassword: '',
  })

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({
    email: '',
    password: '',
    lastName: '',
    firstName: '',
    repeatPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value,
    })

    handleValidation(name, value)
  }

  const handleValidation = (name: string, value: string) => {
    let newErrors = { ...errors }

    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          newErrors['email'] = 'Por favor, ingresa un correo electrónico válido.'
        } else {
          newErrors['email'] = ''
        }
        break
      case 'password':
        const passwordError = validatePassword(value)
        if (passwordError) {
          newErrors['password'] = passwordError
        } else {
          newErrors['password'] = ''
        }
        break
      case 'repeatPassword':
        if (value !== data.password) {
          newErrors['repeatPassword'] =
            'Las contraseñas no coinciden. Por favor, verifica y vuelve a intentarlo.'
        } else {
          newErrors['repeatPassword'] = ''
        }
        break
      default:
        break
    }

    setErrors(newErrors)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    let valid = true
    const newErrors = {
      email: '',
      username: '',
      password: '',
      repeatPassword: '',
      firstName: '',
      lastName: '',
    }
    if (!validateEmail(data.email)) {
      newErrors.email = 'Por favor, ingresa un correo electrónico válido.'
      valid = false
    }

    const passwordError = validatePassword(data.password)
    if (passwordError) {
      newErrors.password = passwordError
      valid = false
    }

    if (data.password !== data.repeatPassword) {
      newErrors.repeatPassword =
        'Las contraseñas no coinciden. Por favor, verifica y vuelve a intentarlo.'
      valid = false
    }

    setErrors(newErrors)

    if (!valid) return

    try {
      await authService.register(data)

      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const registerInputs = [
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      value: data.email,
      placeholder: 'Escribe tu correo electronico',
    },
    {
      label: 'Primer nombre',
      name: 'firstName',
      type: 'text',
      value: data.firstName,
      placeholder: 'Ingresa tu primer nombre',
    },
    {
      label: 'Apellido',
      name: 'lastName',
      type: 'text',
      value: data.lastName,
      placeholder: 'Ingresa tu apellido',
    },
    {
      label: 'Contraseña',
      name: 'password',
      type: 'password',
      value: data.password,
      placeholder: 'Ingresa tu contraseña',
    },
    {
      label: 'Repetir contraseña',
      name: 'repeatPassword',
      type: 'password',
      value: data.repeatPassword,
      placeholder: 'Repite la contraseña',
    },
  ]

  return (
    <AuthBody onSubmit={handleRegister}>
      <AuthHeader title='Crea tu cuenta' />
      <AuthForm inputs={registerInputs} handleChange={handleChange} errors={errors} />
      <AuthSubmit label='Continuar' />
      <Or />
      <ContinueWithGoogle />
      <AuthFooter href='/login' label='¿Ya estás registrado?' hrefLabel='Haz click aquí' />
    </AuthBody>
  )
}
