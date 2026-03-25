import { ENV } from '@/constants'
import Cookies from 'js-cookie'
import { serverMode } from '@/constants'
import { ServerMode } from '@/api/interfaces'

export const setAuthCookie = (name: string, value: string) => {
  Cookies.set(name, value, {
    expires: 30,
    ...(serverMode === ServerMode.PRODUCTION && {
      sameSite: 'None',
      domain: import.meta.env['VITE_DOMAIN'],
      secure: true,
    }),
  })
}

export const clearAuthCookies = () => {
  Cookies.remove('accessToken', { domain: ENV['VITE_DOMAIN'] })
  Cookies.remove('refreshToken', { domain: ENV['VITE_DOMAIN'] })
}

export const redirectToLogin = () => {
  const currentPath = window.location.pathname
  const targetPath = "/login"

  if (currentPath.endsWith(targetPath)) return

  clearAuthCookies()
  window.location.href = targetPath
}
