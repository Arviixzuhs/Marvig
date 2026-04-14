import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { authService } from '@/modules/auth/services'
import { setMyUser } from '@/features/userSlice'
import { setAuthCookie } from '@/utils/setAuthCookie'

export const ContinueWithGoogle = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    const { credential } = credentialResponse

    if (!credential) {
      toast.error('No se recibió el token de Google.')
      return
    }

    try {
      const response = await authService.googleAuth(credential)
      const { user } = response.data

      // Actualiza el estado global de Redux con los datos del usuario
      dispatch(setMyUser(user))

      toast.success(`¡Bienvenido, ${user.name}!`)
      navigate('/')
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status === 401) {
        toast.error('Token de Google inválido o expirado.')
      } else {
        toast.error('Error al iniciar sesión con Google.')
      }
    }
  }

  const handleGoogleError = () => {
    toast.error('No se pudo conectar con Google. Intenta de nuevo.')
  }

  return (
    <div className='flex items-center justify-center w-full' id='google-login-container'>
      {/*
        GoogleLogin renderiza el botón oficial de Google Identity Services.
        El prop `useOneTap` habilita el flujo de "un solo clic" al cargar la página.
        El prop `onSuccess` recibe directamente el credential (ID Token JWT firmado por Google).
      */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
        width='100%'
        text='continue_with'
        locale='es'
        shape='rectangular'
        theme='outline'
        logo_alignment='left'
      />
    </div>
  )
}
