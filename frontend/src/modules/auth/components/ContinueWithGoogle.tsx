import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import Google from '@/assets/icons/google.svg'

export const ContinueWithGoogle = () => {
  const popupRef = useRef<Window | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data === 'closePopup' && popupRef.current) {
        popupRef.current.close()
        navigate('/')
      }
    }

    window.addEventListener('message', listener)

    return () => window.removeEventListener('message', listener)
  }, [])

  const handleLogin = () => {
    const googleLoginUrl = import.meta.env['VITE_SERVER_API'] + '/oauth2/authorization/google'
    const width = 500
    const height = 600
    const left = window.screenX + (window.innerWidth - width) / 2
    const top = window.screenY + (window.innerHeight - height) / 2

    popupRef.current = window.open(
      googleLoginUrl,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`,
    )
  }

  return (
    <div className='flex items-center gap-5 justify-center w-full'>
      <button
        type='button'
        onClick={handleLogin}
        className='bg-white w-full rounded-lg h-11 flex items-center justify-center border border-gray-200'
      >
        <img src={Google} className='w-[20px] h-[20px]' />

        <span className='ml-3 text-sm font-medium text-gray-700'>Continuar con Google</span>
      </button>
    </div>
  )
}
