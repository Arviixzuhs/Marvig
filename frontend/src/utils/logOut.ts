import { authApi } from '@/api/axios-client'

export const logOut = async () => {
  try {
    await authApi.post('/auth/logout')
  } catch (error) {
    console.error('Error al cerrar sesión', error)
  }

  localStorage.removeItem('theme')
  localStorage.removeItem('token')
  window.location.href = '/'
}
