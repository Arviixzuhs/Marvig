import toast from 'react-hot-toast'
import { useRef } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { setMyUser } from '@/features/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { authService } from '@/modules/auth/services'

export const ContinueWithGoogle = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const hiddenButtonRef = useRef<HTMLDivElement>(null)

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    const { credential } = credentialResponse

    if (!credential) {
      toast.error('No se recibió el token de Google.')
      return
    }

    try {
      const response = await authService.googleAuth(credential)

      const { user } = response.data

      dispatch(setMyUser(user))

      toast.success(`¡Bienvenido, ${user.name}!`)

      navigate('/')
    } catch (error: any) {
      console.error(error)

      const status = error?.response?.status

      if (status === 401) {
        toast.error('Token de Google inválido o expirado.')
      } else {
        toast.error('Error al iniciar sesión con Google.')
      }
    }
  }

  const handleGoogleError = () => {
    toast.error('No se pudo conectar con Google.')
  }

  const triggerGoogleLogin = () => {
    const button = hiddenButtonRef.current?.querySelector('div[role=button]') as HTMLElement | null
    button?.click()
  }

  return (
    <div className='w-full'>
      <button
        type='button'
        onClick={triggerGoogleLogin}
        className='bg-white w-full gap-4 cursor-pointer rounded-lg h-11 flex items-center justify-center border border-gray-200'
      >
        <FcGoogle className='w-5 h-5' />
        <span className='text-sm font-semibold text-gray-700'>Continuar con Google</span>
      </button>
      <div ref={hiddenButtonRef} className='hidden'>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
        />
      </div>
    </div>
  )
}
