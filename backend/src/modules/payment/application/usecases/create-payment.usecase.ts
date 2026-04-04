import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { CreatePaymentDto } from '@/modules/payment/application/dto/create-payment.dto'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { Inject, Injectable } from '@nestjs/common'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryPort,

    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(filters: CreatePaymentDto): Promise<PaymentModel> {
    const reservation = await this.reservationRepository.findReservationById(filters.reservationId)
    if (!reservation) throw new Error('Reservation not found')

    if (reservation.status !== ReservationStatus.CONFIRMED) {
      this.reservationRepository.updateStatus(filters.reservationId, ReservationStatus.CONFIRMED)
    }

    return await this.paymentRepository.createPayment(filters)
  }
}
