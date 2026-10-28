import { ServerMode } from '@/api/interfaces'
export const ENV = import.meta.env

export const serverMode: ServerMode = ENV['VITE_SERVER_MODE']

const COMPANY_NAME = 'Marvig'
const COMPANY_PHONE = '+58 4126229592'

export const companyInfo = {
  company: COMPANY_NAME,
  address: 'Transversal 3, numero 8, San Lorenzo, municipio Manerio',
  contact: {
    phone: COMPANY_PHONE,
    mail: 'posada.marvig@gmail.com',
  },
  socials: {
    instagram: {
      url: 'https://www.instagram.com/posada_marvig/',
      user: '@posada_marvig',
    },
  },
  payment: {
    pagoMovil: {
      bank: { name: 'Banco Mercantil', code: '0105' },
      phone: COMPANY_PHONE,
      document: 'V-12345678',
    },
    bankTransfer: {
      bank: 'Banco Mercantil',
      accountType: 'Corriente',
      accountNumber: '0105-0000-00-0000000000',
      holder: COMPANY_NAME,
      document: 'J-12345678-0',
    },
  },
}
