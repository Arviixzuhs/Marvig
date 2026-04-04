import { BaseMapper } from '@/common/mappers/base.mapper'
import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { ReservationMapper } from '@/modules/reservation/infrastructure/mappers/reservation.mapper'
import { Payment as PrismaPayment, Reservation as PrismaReservation } from 'generated/prisma/client'

type PrismaPaymentWithRelations = PrismaPayment & {
  reservation?: PrismaReservation
}

export class PaymentMapper extends BaseMapper<PrismaPaymentWithRelations, PaymentModel> {
  private readonly reservationMapper = new ReservationMapper()

  modelToDomain(model: PrismaPaymentWithRelations): PaymentModel {
    return {
      id: model.id,
      amount: Number(model.amount),
      status: model.status as PaymentStatus,
      method: model.method as PaymentMethod,
      reference: model.reference,
      date: model.date,
      description: model.description,
      reservationId: model.reservationId,
      createdAt: model.createdAt,
      reservation: model.reservation
        ? this.reservationMapper.modelToDomain(model.reservation)
        : undefined,
    }
  }
}
