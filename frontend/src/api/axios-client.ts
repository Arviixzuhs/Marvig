import { ENV } from '@/constants'
import axios from 'axios'
import qs from 'qs'
import toast from 'react-hot-toast'

export const authApi = axios.create({
  baseURL: ENV['VITE_SERVER_API'],
  withCredentials: true,
})

export const api = axios.create({
  baseURL: ENV['VITE_SERVER_API'],
  withCredentials: true,
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  },
  paramsSerializer: (params) =>
    qs.stringify(params, {
      encode: false,
      allowDots: true,
      arrayFormat: 'repeat',
    }),
})

// Interceptor para manejar errores y mostrarlos
const handleError = (error: any) => {
  if (error.response?.status === 403) {
    window.location.href = '/'
  }

  if (error && error.status !== 404) {
    let errorMessage = ''

    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }

    if (error?.response?.data?.errors && error?.response?.data?.errors[0]) {
      errorMessage = error.response?.data?.errors[0]?.message || error.response?.data?.errors[0]
    }

    if (errorMessage?.trim() !== '') {
      toast.error(errorMessage)
    }
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    handleError(error)
    return Promise.reject(error)
  },
)

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    handleError(error)
    return Promise.reject(error)
  },
)
