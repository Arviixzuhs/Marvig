import { UserRole } from "@/models/UserModel"

export interface User {
  iat: number
  exp: number
  sub: string
  role: UserRole
  userId: number
}
