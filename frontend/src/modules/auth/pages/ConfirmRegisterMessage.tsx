import React from 'react'
import { AuthBody } from '@/modules/auth/components/AuthBody'
import { RootState } from '@/store'
import { AuthHeader } from '@/modules/auth/components/AuthHeader'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ConfirmRegisterMessage = () => {
  const navigate = useNavigate()

  const authFormData = useSelector((state: RootState) => state.auth)

  React.useEffect(() => {
    if (!authFormData.email || authFormData.email.trim() === '') {
      navigate('/login')
    }
  }, [authFormData.email])

  return (
    <AuthBody>
      <div className='flex flex-col gap-6 items-center justify-center w-full'>
        <AuthHeader
          title='Verificación de identidad'
          description={
            <div className='text-center'>
              <p>
                Enviamos un <span className='text-blue-500'>enlace de registro</span> a su correo
                electrónico. Para completar la configuración de su cuenta, por favor confirme su
                identidad.
              </p>
            </div>
          }
        />
      </div>
    </AuthBody>
  )
}

export default ConfirmRegisterMessage