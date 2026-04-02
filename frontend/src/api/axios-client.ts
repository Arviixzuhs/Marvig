import { ENV } from '@/constants'
import axios from 'axios'
import qs from 'qs'

export const authApi = axios.create({
  baseURL: ENV['VITE_SERVER_API'],
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
