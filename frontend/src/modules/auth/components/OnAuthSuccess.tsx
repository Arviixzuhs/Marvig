import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { serverMode } from '@/constants'
import { ServerMode } from '@/api/interfaces'

export const OAuthSuccess = () => {
  const params = useParams<{
    accessToken: string
    refreshToken: string
  }>()

  useEffect(() => {
    if (!params.accessToken || !params.refreshToken) return
    if (serverMode === ServerMode.DEVELOPMENT) {
      Cookies.set('accessToken', params.accessToken, {
        expires: 30,
        domain: import.meta.env['VITE_DOMAIN'],
      })
      Cookies.set('refreshToken', params.refreshToken, { expires: 30 })
    }

    if (window.opener) {
      window.opener.postMessage('closePopup', '*')
    }
  }, [])

  return <div className='flex items-center justify-center h-screen'></div>
}
