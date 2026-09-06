import React from 'react'
import { Or } from '@/modules/auth/components/Or'
import { AuthForm } from '@/modules/auth/components/AuthInputForm'
import { AuthBody } from '@/modules/auth/components/AuthBody'
import { AuthFooter } from '@/modules/auth/components/AuthFooter'
import { AuthHeader } from '@/modules/auth/components/AuthHeader'
import { AuthSubmit } from '@/modules/auth/components/AuthSubmit'
import { authService } from '@/modules/auth/services'
import { ContinueWithGoogle } from '@/modules/auth/components/ContinueWithGoogle'
import type { IAuthSigning } from '@/modules/auth/services/interfaces'
import { useNavigate } from 'react-router-dom'
import { setAuthFormdata } from '../slice/authSlice'
import { useDispatch } from 'react-redux'
const MAX_LENGTH = 100

export const RegisterPage = () => {
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const [data, setData] = React.useState<IAuthSigning>({
    email: '',
    name: '',
    lastName: '',
  })

  const [errors, setErrors] = React.useState<{
    [key: string]: string
  }>({
    name: '',
    email: '',
    lastName: '',
  })

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validateField = (name: string, value: string): string => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      switch (name) {
        case 'email':
          return 'Por favor, ingresa un correo electrónico.'
        case 'name':
          return 'Por favor, ingresa un nombre.'
        case 'lastName':
          return 'Por favor, ingresa tu apellido.'
        default:
          return 'Este campo es obligatorio.'
      }
    }

    if (value.length > MAX_LENGTH) {
      return `Este campo no puede superar los ${MAX_LENGTH} caracteres.`
    }

    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          return 'Por favor, ingresa un correo electrónico válido.'
        }
        break
      case 'name':
      case 'lastName':
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          return 'Solo se permiten letras.'
        }
        break
    }

    return ''
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (value.length > MAX_LENGTH) {
      return
    }

    setData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors = {
      email: validateField('email', data.email),
      username: validateField('name', data.name),
      lastName: validateField('lastName', data.lastName),
    }

    setErrors(newErrors)

    return Object.values(newErrors).every((error) => error === '')
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await authService.signing(data)

      dispatch(
        setAuthFormdata({
          name: 'email',
          value: data.email,
        }),
      )

      navigate('/register/message')
    } catch (error) {
      console.log(error)
    }
  }

  const registerInputs = [
    {
      label: 'Nombre',
      name: 'name',
      type: 'text',
      value: data.name,
      maxLength: MAX_LENGTH,
      placeholder: 'Ingresa tu nombre.',
    },
    {
      label: 'Apellido',
      name: 'lastName',
      type: 'text',
      value: data.lastName,
      maxLength: MAX_LENGTH,
      placeholder: 'Ingresa tu apellido',
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      value: data.email,
      maxLength: MAX_LENGTH,
      placeholder: 'Escribe tu correo electrónico',
    },
  ]

  return (
    <>
      <AuthBody onSubmit={handleRegister}>
        <AuthHeader title='Crea tu cuenta' />
        <AuthForm inputs={registerInputs} handleChange={handleChange} errors={errors} />
        <AuthSubmit label='Continuar' />
        <Or />
        <ContinueWithGoogle />
        <AuthFooter href='/login' label='¿Ya estás registrado?' hrefLabel='Haz click aquí' />
      </AuthBody>
    </>
  )
}
