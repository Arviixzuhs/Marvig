import { UserRole } from '@/common/enums/user-role.enum'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'

export class UserModel {
  id: number
  name: string
  role: UserRole
  email?: string | null
  avatar?: string | null
  phone?: string | null
  lastName: string
  createdAt?: Date | null
  updatedAt?: Date | null
  hasPassword?: boolean
  reservations: ReservationModel[]
}
