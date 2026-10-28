import { UserRole } from "@/common/enums/user-role.enum"

export interface User {
  iat: number
  exp: number
  sub: string
  role: UserRole
  userId: number
}
