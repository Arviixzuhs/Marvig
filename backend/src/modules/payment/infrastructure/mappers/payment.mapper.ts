import { BaseMapper } from '@/common/mappers/base.mapper'
import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { Payment as PrismaPayment, Reservation as PrismaReservation } from 'generated/prisma/client'
import { ReservationMapper } from '@/modules/reservation/infrastructure/mappers/reservation.mapper'

type PrismaPaymentWithRelations = PrismaPayment & {
  reservation?: PrismaReservation
}

export class PaymentMapper extends BaseMapper<PrismaPaymentWithRelations, PaymentModel> {
  private readonly reservationMapper = new ReservationMapper()

  modelToDomain(model: PrismaPaymentWithRelations): PaymentModel {
    return {
      id: model.id,
      amount: Number(model.amount),
      description: model.description,
      reservationId: model.reservationId,
      createdAt: model.createdAt,
      reservation: model.reservation
        ? this.reservationMapper.modelToDomain(model.reservation)
        : undefined,
    }
  }
}
