import { UserRole } from '@/common/enums/user-role.enum'
import { SetMetadata } from '@nestjs/common'

export const RequiredRole = (role: UserRole) => SetMetadata('role', role)
