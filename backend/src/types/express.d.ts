import { User } from '@/interfaces/user.interface'

declare module 'express' {
  interface Request {
    user?: User
  }
}
