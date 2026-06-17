import { ENV } from '@/constants'
import axios from 'axios'
import qs from 'qs'

export const api = axios.create({
  baseURL: ENV['VITE_SERVER_API'],
  withCredentials: true,
  paramsSerializer: (params) =>
    qs.stringify(params, {
      encode: false,
      allowDots: true,
      arrayFormat: 'repeat',
    }),
})

// Interceptor para logging de peticiones
api.interceptors.request.use((config) => {
  console.log(process.env.API_URL)
  console.log('🔵 Enviando petición a:', config.url)
  console.log('📦 Config:', {
    method: config.method,
    params: config.params,
    data: config.data,
    headers: config.headers,
  })
  return config
})

// Interceptor de respuestas para manejo centralizado de errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      console.error('📦 Error en respuesta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      })
    } else if (error.request) {
      console.error('🔌 No se recibió respuesta:', error.request)
    } else {
      console.error('⚠️ Error al configurar petición:', error.message)
    }
    return Promise.reject(error)
  },
)
