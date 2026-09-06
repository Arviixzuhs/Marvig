import { useDispatch, useSelector } from 'react-redux'

import { useCodeCooldownContext } from '@/context/VerificationCodeCooldownProvider'
import { verificationCodeService } from '@/services/verificationCode'
import { VerificationCodeType } from '@/models/VerificationCodeModel'

import { AuthBody } from '@/modules/auth/components/AuthBody'
import { AuthHeader } from '@/modules/auth/components/AuthHeader'
import { AuthForm } from '@/modules/auth/components/AuthInputForm'
import { AuthSubmit } from '@/modules/auth/components/AuthSubmit'
import { RootState } from '@/store'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthFormdata } from '../slice/authSlice'
import { validateEmail } from '@/utils/validateEmail'

const RecoverPasswordEmail = () => {
  const dispatch = useDispatch()
  const email = useSelector((state: RootState) => state.auth.email)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const { markCodeCreated, canResend, timeLeft } = useCodeCooldownContext()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch(
      setAuthFormdata({
        name,
        value,
      }),
    )
    handleValidation(name, value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    handleValidation(name, value)
  }

  const handleValidation = (name: string, value: string) => {
    let newErrors = { ...errors }
    const validationResponse = validateEmail(value)
    if (!validationResponse) {
      newErrors[name] = 'Por favor, ingresa un correo electrónico válido.'
    } else {
      delete newErrors[name]
    }
    setErrors(newErrors)
  }

  const handleSendToken = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (Object.keys(errors).length === 0 && email.length > 0) {
      try {
        await verificationCodeService.create({
          email,
          type: VerificationCodeType.PASSWORD_RESET,
        })

        markCodeCreated(VerificationCodeType.PASSWORD_RESET)
        navigate('/recovery-password/code')
      } catch (error: any) {
        console.log(error)
        setErrors({
          email: error?.response?.message || 'Error enviando el email. Inténtalo nuevamente.',
        })
      }
    }
  }

  const inputs = [
    {
      label: 'Email',
      name: 'email',
      type: 'text',
      placeholder: 'Ingresa tu email',
      onBlur: handleBlur,
      onChange: handleChange,
      value: email,
    },
  ]

  return (
    <AuthBody onSubmit={handleSendToken}>
      <AuthHeader
        title='Recuperación de contraseña'
        description={
          <p className='mb-5'>
            Introduce el correo electrónico que usaste al registrarte para recuperar tu contraseña.
            Recibirás un <span className='text-blue-500'>código</span> para restablecerla.
          </p>
        }
      />
      <AuthForm inputs={inputs} handleChange={handleChange} errors={errors} />
      <AuthSubmit
        label={
          !canResend(VerificationCodeType.PASSWORD_RESET)
            ? timeLeft(VerificationCodeType.PASSWORD_RESET)
            : 'Enviar email'
        }
        timeLeft={timeLeft(VerificationCodeType.PASSWORD_RESET)}
        disabled={!canResend(VerificationCodeType.PASSWORD_RESET)}
      />
    </AuthBody>
  )
}

export default RecoverPasswordEmail
