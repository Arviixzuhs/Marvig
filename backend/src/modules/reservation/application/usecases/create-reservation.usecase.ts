import { UserRole } from '@/common/enums/user-role.enum'
import { EmailService } from '@/common/utils/mail-sender.util'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { CreateReservationDto } from '@/modules/reservation/application/dto/create-reservation.dto'
import { SeasonRepositoryPort } from '@/modules/season/domain/repositories/season.repository.port'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { getReservationEmailContent } from '@/common/utils/get-reservation-email-template.util'
import { ApartmentNotAvailableError } from '@/common/errors/apartment-not-available.error'
import { ConcurrentReservationError } from '@/common/errors/concurrent-reservation.error'
import { calcTotalByApartmentsAndDates } from '@/common/utils/calc-total-by-apartments.util'
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

    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryPort,

    @Inject('SeasonRepository')
    private readonly seasonRepository: SeasonRepositoryPort,

    private readonly emailService: EmailService,
  ) {}

  async execute(data: CreateReservationDto, userId: number): Promise<ReservationModel> {
    const user = await this.userRepository.findUser(userId)
    if (!user) throw new NotFoundException('El usuario no existe')

    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    if (startDate >= endDate) {
      throw new BadRequestException('La fecha de entrada debe ser anterior a la de salida')
    }

    const apartments = await this.apartmentRepository.findApartments({ ids: data.apartmentIds })

    if (apartments.content.length !== data.apartmentIds.length) {
      throw new NotFoundException('Algunos de los apartamentos no existen')
    }

    if (apartments.content.some((a) => a.status === ApartmentStatusEnum.MAINTENANCE)) {
      throw new ConflictException('Uno o más apartamentos están en mantenimiento.')
    }

    const seasons = await this.seasonRepository.findOverlappingSeasons({
      endDate,
      startDate,
      apartmentIds: data.apartmentIds,
    })

    const finalTotal = calcTotalByApartmentsAndDates({
      seasons,
      endDate,
      startDate,
      apartments: apartments.content,
    })

    if (Math.abs(finalTotal - data.totalPrice) > 0.01) {
      throw new BadRequestException(
        `Discrepancia de precio: Calculado ${finalTotal} vs Enviado ${data.totalPrice}`,
      )
    }

    const isAdmin = user.role === UserRole.ADMIN
    const paymentStatus = isAdmin ? PaymentStatus.CONFIRMED : PaymentStatus.PENDING

    let createdReservation: ReservationModel
    try {
      createdReservation = await this.reservationRepository.createReservationWithRelations({
        userId,
        userRole: user.role,
        reservation: {
          ...data,
          status: isAdmin ? data.status : ReservationStatus.PENDING,
          totalPrice: finalTotal,
        },
        payment: {
          date: new Date(),
          amount: finalTotal,
          status: paymentStatus,
          method: data.payment.method,
          reference: data.payment.reference,
          description: data.payment.description,
        },
      })
    } catch (error) {
      if (error instanceof ApartmentNotAvailableError) {
        throw new ConflictException(
          'Uno o más apartamentos ya se encuentran reservados en ese rango de fechas.',
        )
      }

      if (error instanceof ConcurrentReservationError) {
        throw new ConflictException(
          'Otra reserva se estaba procesando al mismo tiempo. Intenta de nuevo.',
        )
      }

      throw error
    }

    const recipientEmail = data.clientEmail || user.email
    const recipientName = data.clientName || user.name || 'Cliente'

    if (recipientEmail) {
      const reservationUrl = `${process.env.CLIENT_ORIGIN}/reservations`

      this.emailService.sendSingleEmail({
        to: recipientEmail,
        subject: `Solicitud de reserva recibida - Posada Marvig (Ref. ${data.payment.reference})`,
        title: 'Hemos registrado tu reserva',
        subtitle: `Hola, ${recipientName}`,
        content: getReservationEmailContent({
          startDate,
          endDate,
          total: finalTotal,
          paymentReference: data.payment.reference,
          reservationUrl,
        }),
      })
    }

    return createdReservation
  }
}
