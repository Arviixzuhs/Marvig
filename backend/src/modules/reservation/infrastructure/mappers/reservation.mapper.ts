import { BaseMapper } from '@/common/mappers/base.mapper'
import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import {
  Reservation as PrismaReservation,
  Apartment as PrismaApartment,
  Payment as PrismaPayment,
} from 'generated/prisma/client'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'

type PrismaReservationWithRelations = PrismaReservation & {
  apartments?: PrismaApartment[]
  payments?: PrismaPayment[]
}

export class ReservationMapper extends BaseMapper<PrismaReservationWithRelations, ReservationModel> {
  modelToDomain(model: PrismaReservationWithRelations): ReservationModel {
    return {
      id: model.id,
      type: model.type as RentalType,
      userId: model?.userId,
      status: model.status as ReservationStatus,
      endDate: model.endDate,
      persons: model?.persons,
      startDate: model.startDate,
      clientEmail: model.clientEmail,
      clientName: model.clientName,
      clientPhone: model.clientPhone,
      totalPrice: Number(model.totalPrice),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      apartments: model.apartments
        ? model.apartments.map((apt) => ({
            id: apt.id,
            floor: apt.floor,
            number: apt.number,
            status: apt.status as ApartmentStatusEnum,
            bedrooms: apt.bedrooms,
            bathrooms: apt.bathrooms,
            pricePerDay: Number(apt.pricePerDay),
            promotionId: apt.promotionId,
            squareMeters: apt.squareMeters,
            createdAt: apt.createdAt,
            updatedAt: apt.updatedAt,
          }))
        : [],
      payments: model.payments
        ? model.payments.map((pay) => ({
            id: pay.id,
            amount: Number(pay.amount),
            status: pay.status as PaymentStatus,
            method: pay.method as PaymentMethod,
            reference: pay.reference,
            date: pay.date,
            description: pay.description,
            reservationId: pay.reservationId,
            createdAt: pay.createdAt,
          }))
        : undefined,
    }
  }
}

