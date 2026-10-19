import { UserRole } from '@/common/enums/user-role.enum'
import { EmailService } from '@/common/utils/mail-sender.util'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { NotificationType } from '@/modules/notification/domain/enums/notification-type.enum'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'
import { NotificationStatus } from '@/modules/notification/domain/enums/notification-status.enum'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { CreateReservationDto } from '@/modules/reservation/application/dto/create-reservation.dto'
import { getFormattedDateTime } from '@/common/utils/getFormattedDateTime'
import { calcTotalByApartments } from '@/common/utils/calc-total-by-apartments.util'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { NotificationRepositoryPort } from '@/modules/notification/domain/repositories/notification.repository.port'
import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,

    @Inject('ApartmentRepository')
    private readonly apartmentRepository: ApartmentRepositoryPort,

    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryPort,

    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryPort,

    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepositoryPort,

    private readonly emailService: EmailService,
  ) {}

  async execute(data: CreateReservationDto, userId: number): Promise<ReservationModel> {
    const user = await this.userRepository.findUser(userId)
    if (!user) throw new NotFoundException('El usuario no existe')

    const today = new Date()
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const start = new Date(data.startDate)
    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    const end = new Date(data.endDate)

    if (start >= end) {
      throw new BadRequestException('La fecha de entrada debe ser anterior a la de salida')
    }

    const apartments = await this.apartmentRepository.findApartments({
      ids: data.apartmentIds,
    })

    if (apartments.content.length !== data.apartmentIds.length) {
      throw new NotFoundException('Algunos de los apartamentos no existen')
    }

    const hasUnavailableApartment = apartments.content.some(
      (apartment) => apartment.status === ApartmentStatusEnum.MAINTENANCE,
    )

    if (hasUnavailableApartment) {
      throw new ConflictException('Uno de los apartamentos están en mantenimiento.')
    }

    const isAvailable = await this.reservationRepository.checkAvailability(
      data.apartmentIds,
      start,
      end,
    )

    if (!isAvailable) {
      throw new ConflictException('Uno o más apartamentos ya se encuentran reservados en ese rango de fechas.')
    }

    const finalTotal = calcTotalByApartments({
      endDate: end,
      startDate: start,
      apartments: apartments.content,
    })

    if (Math.abs(finalTotal - data.totalPrice) > 0.01) {
      throw new BadRequestException(
        `Discrepancia de precio: Calculado ${finalTotal} vs Enviado ${data.totalPrice}`,
      )
    }

    const createdReservation = await this.reservationRepository.createReservation(
      {
        ...data,
        totalPrice: finalTotal,
      },
      userId,
    )

    const isUserAdmin = user?.role === UserRole.ADMIN
    const paymentStatus = isUserAdmin ? PaymentStatus.CONFIRMED : PaymentStatus.PENDING

    const createdPayment = await this.paymentRepository.createPayment({
      date: new Date(),
      amount: finalTotal,
      status: paymentStatus,
      method: data.payment.method,
      reference: data.payment.reference,
      description: data.payment.description,
      reservationId: createdReservation.id,
    })

    const isConfirmed = createdPayment.status === PaymentStatus.CONFIRMED
    const notificationTitle = isConfirmed ? '¡Pago Confirmado!' : 'Pago Registrado'
    const notificationBody = isConfirmed
      ? `Tu pago de $${finalTotal} por la reservación #${createdReservation.id} ha sido confirmado con éxito.`
      : `Hemos recibido tu reporte de pago por $${finalTotal} (Ref: ${data.payment.reference}). Está en proceso de verificación.`


    await this.notificationRepository.createNotification({
      body: notificationBody,
      type: NotificationType.PAYMENT_ACTIVITY,
      title: notificationTitle,
      status: NotificationStatus.UNREAD,
      userId: user.id,
      userTargetRole: UserRole.ADMIN,
    })


    const newApartmentStatus = todayMidnight.getTime() === startMidnight.getTime()
      ? ApartmentStatusEnum.OCCUPIED
      : ApartmentStatusEnum.RESERVED

    await this.apartmentRepository.updateStatusByApartmentIds(
      data.apartmentIds,
      newApartmentStatus,
    )

    const recipientEmail = data.clientEmail || user?.email
    const recipientName = data.clientName || user?.name || 'Cliente'

    if (recipientEmail) {
      this.emailService.sendSingleEmail({
        to: recipientEmail,
        subject: 'Confirmación de Reserva - Posada Marvig',
        title: '¡Tu reserva ha sido confirmada!',
        subtitle: `Hola, ${recipientName}`,
        content: `
        <p>Nos complace informarte que tu reserva se ha procesado correctamente. A continuación, encontrarás el resumen de tu estancia:</p>
        <div class="reservation-details">
          <p><strong>Fecha de Entrada:</strong> ${getFormattedDateTime({ value: start })}</p>
          <p><strong>Fecha de Salida:</strong> ${getFormattedDateTime({ value: end })}</p>
          <p><strong>Total Pagado:</strong> $${finalTotal}</p>
          <p style="margin-top: 8px; font-size: 13px; color: #71717a;">
            Pago ref. <strong>${createdPayment.reference}</strong>
          </p>
        </div>
      `,
      })
    }

    return createdReservation
  }
}