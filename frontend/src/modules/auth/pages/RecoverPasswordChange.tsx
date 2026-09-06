import toast from 'react-hot-toast'

import { authService } from '../services'

import { useSelector } from 'react-redux'

import { AuthBody } from '@/modules/auth/components/AuthBody'
import { AuthHeader } from '@/modules/auth/components/AuthHeader'
import { AuthSubmit } from '@/modules/auth/components/AuthSubmit'
import { RootState } from '@/store'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthForm } from '../components/AuthInputForm'

const RecoverPasswordChange = () => {
  const navigate = useNavigate()

  const authFormData = useSelector((state: RootState) => state.auth)

  const [data, setData] = React.useState({
    newPassword: '',
    repeatNewPassword: '',
  })

  const [errors, setErrors] = React.useState({
    newPassword: '',
    repeatNewPassword: '',
  })

  const validateField = (name: string, value: string, currentData: typeof data) => {
    switch (name) {
      case 'newPassword':
        if (!value.trim()) return 'Por favor, ingresa tu nueva contraseña.'
        if (value.trim().length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
        return ''
      case 'repeatNewPassword':
        if (!value) return 'Por favor, confirma tu contraseña.'
        if (value !== currentData.newPassword) return 'Las contraseñas no coinciden.'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    const newData = { ...data, [name]: value }
    setData(newData)

    setErrors((prevErrors) => {
      const updatedErrors = {
        ...prevErrors,
        [name]: validateField(name, value, newData),
      }

      if (name === 'newPassword') {
        updatedErrors.repeatNewPassword = validateField(
          'repeatNewPassword',
          newData.repeatNewPassword,
          newData,
        )
      }

      return updatedErrors
    })
  }

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const finalErrors = {
      newPassword: validateField('newPassword', data.newPassword, data),
      repeatNewPassword: validateField('repeatNewPassword', data.repeatNewPassword, data),
    }

    setErrors(finalErrors)

    const hasErrors = Object.values(finalErrors).some((error) => error !== '')
    if (hasErrors) {
      toast.error('Por favor, revisa los errores en el formulario.')
      return
    }

    try {
      await authService.changePasswordByCode({
        code: authFormData.code,
        email: authFormData.email,
        newPassword: data.newPassword,
        repeatNewPassword: data.repeatNewPassword,
      })

      toast.success('Contraseña actualizada correctamente.')
      navigate('/login')
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Error al cambiar la contraseña. Por favor, inténtalo de nuevo.',
      )
    }
  }

  const passwordInputs = [
    {
      label: 'Nueva contraseña',
      name: 'newPassword',
      type: 'password',
      placeholder: 'Ingresa tu nueva contraseña',
    },
    {
      label: 'Confirmar contraseña',
      name: 'repeatNewPassword',
      type: 'password',
      placeholder: 'Repite tu contraseña',
    },
  ]

  return (
    <AuthBody onSubmit={handlePasswordChange}>
      <AuthHeader title='Crea una nueva contraseña' />
      <AuthForm inputs={passwordInputs} handleChange={handleChange} errors={errors} />
      <AuthSubmit label='Cambiar contraseña' />
    </AuthBody>
  )
}

export default RecoverPasswordChange
