import { UserModel } from '@/modules/user/domain/models/user.model'
import { BaseMapper } from '@/common/mappers/base.mapper'
import { ReservationMapper } from '@/modules/reservation/infrastructure/mappers/reservation.mapper'
import { User as PrismaUser, Reservation as PrismaReservation } from 'generated/prisma/client'

type PrismaUserWithRelations = PrismaUser & {
  reservations?: PrismaReservation[]
}

export class UserMapper extends BaseMapper<PrismaUserWithRelations, UserModel> {
  private readonly reservationMapper = new ReservationMapper()

  modelToDomain(model: PrismaUserWithRelations): UserModel {
    return {
      id: model.id,
      name: model.name,
      lastName: model.lastName,
      email: model.email,
      avatar: model.avatar,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      reservations: model.reservations
        ? this.reservationMapper.modelsToDomain(model.reservations)
        : [],
    }
  }
}
