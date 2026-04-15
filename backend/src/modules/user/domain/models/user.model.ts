import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'

export class UserModel {
  id: number
  name: string
  lastName: string
  email?: string | null
  avatar?: string | null
  createdAt?: Date | null
  updatedAt?: Date | null
  reservations: ReservationModel[]
}
