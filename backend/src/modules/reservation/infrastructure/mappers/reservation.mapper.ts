import { BaseMapper } from '@/common/mappers/base.mapper'
import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { Reservation as PrismaReservation } from 'generated/prisma/client'

export class ReservationMapper extends BaseMapper<PrismaReservation, ReservationModel> {
  modelToDomain(model: PrismaReservation): ReservationModel {
    return {
      id: model.id,
      type: model.type as RentalType,
      userId: model?.userId,
      status: model.status as ReservationStatus,
      endDate: model.endDate,
      startDate: model.startDate,
      clientEmail: model.clientEmail,
      clientName: model.clientName,
      clientPhone: model.clientPhone,
      totalPrice: Number(model.totalPrice),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      apartments: [],
    }
  }
}
