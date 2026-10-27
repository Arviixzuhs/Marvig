import { ServerMode } from '@/api/interfaces'
export const ENV = import.meta.env

export const serverMode: ServerMode = ENV['VITE_SERVER_MODE']
export const companyInfo = {
  company: 'Marvig',
  address: 'Transversal 3, numero 8, San Lorenzo, municipio Manerio',
  contact: {
    phone: '+58 4126229592',
    mail: 'posada.marvig@gmail.com',
  },
  socials: {
    instagram: {
      url: 'https://www.instagram.com/posada_marvig/',
      user: '@posada_marvig',
    },
  },
}
