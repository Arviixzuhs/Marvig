import { UserRole } from '@/common/enums/user-role.enum'
import { UserModel } from '@/modules/user/domain/models/user.model'
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

  async execute(data: CreateReservationDto, userId?: number): Promise<ReservationModel> {
    let user: UserModel | null = null

    if (userId) {
      user = await this.userRepository.findUser(userId)
      if (!user) throw new NotFoundException('El usuario no existe')
    }

    const toDay = new Date()
    const start = new Date(data.startDate)
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

    const isAvailable = await this.reservationRepository.checkAvailability(
      data.apartmentIds,
      start,
      end,
    )

    if (!isAvailable) {
      throw new ConflictException('Uno o más apartamentos no están disponibles.')
    }

    const hasUnavailableApartment = apartments.content.some(
      (apartment) => apartment.status === ApartmentStatusEnum.MAINTENANCE,
    )

    if (hasUnavailableApartment) {
      throw new ConflictException('Uno de los apartamentos está en mantenimiento.')
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

    const createdPayment = await this.paymentRepository.createPayment({
      date: new Date(),
      amount: finalTotal,
      status: user.role === UserRole.ADMIN ? PaymentStatus.CONFIRMED : PaymentStatus.PENDING,
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
    })

    const todayMidnight = new Date(toDay.getFullYear(), toDay.getMonth(), toDay.getDate())
    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate())

    if (todayMidnight.getTime() === startMidnight.getTime()) {
      await this.apartmentRepository.updateStatusByApartmentIds(
        data.apartmentIds,
        ApartmentStatusEnum.OCCUPIED,
      )
    }

    try {
      await this.emailService.sendSingleEmail({
        to: data.clientEmail ? data.clientEmail : user.email,
        subject: 'Confirmación de Reserva',
        title: '¡Tu reserva ha sido confirmada con éxito!',
        subtitle: `Hola, ${data.clientName ? data.clientName : user.name || 'Cliente'}`,
        content: `
          <p>Nos complace informarte que tu reserva se ha procesado correctamente. Aquí tienes los detalles:</p>
          <hr />
          <p><strong>Fecha de Entrada (Check-in):</strong> ${getFormattedDateTime({ value: start })}</p>
          <p><strong>Fecha de Salida (Check-out):</strong> ${getFormattedDateTime({ value: end })}</p>
          <p><strong>Total Pagado:</strong> $${finalTotal}</p>
          <hr />
          <p>El pago con referencia <strong>${createdPayment.reference}</strong> fue aprobado mediante el método de <strong>${createdPayment.method}</strong>.</p>
          <p>¡Gracias por confiar en nosotros! Te esperamos pronto.</p>
        `,
      })
    } catch (emailError) {
      console.error(
        `La reserva #${createdReservation.id} se creó pero falló el envío del email:`,
        emailError,
      )
    }

    return createdReservation
  }
}
