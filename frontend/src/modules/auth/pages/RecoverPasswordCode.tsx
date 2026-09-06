import { InputOtp } from '@heroui/react'

import { VerificationCodeType } from '@/models/VerificationCodeModel'
import { verificationCodeService } from '@/services/verificationCode'
import { useDispatch, useSelector } from 'react-redux'

import { AuthBody } from '@/modules/auth/components/AuthBody'
import { AuthHeader } from '@/modules/auth/components/AuthHeader'
import { AuthSubmit } from '@/modules/auth/components/AuthSubmit'
import { RootState } from '@/store'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthFormdata } from '../slice/authSlice'

const RecoverPasswordCode = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authFormData = useSelector((state: RootState) => state.auth)
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  const handleChange = (value: string) => {
    dispatch(
      setAuthFormdata({
        name: 'code',
        value,
      }),
    )
  }

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    verificationCodeService
      .validate({
        code: authFormData.code,
        type: VerificationCodeType.PASSWORD_RESET,
        email: authFormData.email,
      })
      .then(() => navigate('/recovery-password/change'))
      .catch((error) =>
        setErrorMessage(error.response?.data?.message || 'Error al verificar el pin'),
      )
  }

  return (
    <AuthBody onSubmit={handlePasswordChange}>
      <div className='flex flex-col gap-6 items-center justify-center w-full'>
        <AuthHeader
          title='Verificación de identidad'
          description={
            <div className='text-center'>
              <p>
                Enviamos un
                <span className='text-blue-500'> pin a su email</span> y
                <span className='text-blue-500'> número de celular</span> Por favor ingrese el pin
                de verificación a continuación:
              </p>
            </div>
          }
        />
        <InputOtp
          length={5}
          value={authFormData.code}
          isRequired
          type='password'
          onValueChange={handleChange}
          variant='bordered'
          allowedKeys='^[0-9]*$'
          isInvalid={!!errorMessage}
          errorMessage={errorMessage}
          classNames={{
            base: 'w-full flex flex-col items-center',
            segmentWrapper: 'gap-x-5 w-full',
            segment:
              'w-13 h-13 items-center text-center text-xl border-2 border-blue-400 rounded-lg outline-none',
          }}
        />
        <AuthSubmit label='Continuar' />
      </div>
    </AuthBody>
  )
}

export default RecoverPasswordCode
