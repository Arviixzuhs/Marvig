import { ReservationDto } from '@/modules/reservation/application/dto/reservation.dto'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { Inject, Injectable, ConflictException, BadRequestException } from '@nestjs/common'

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(data: ReservationDto, userId: number): Promise<ReservationModel> {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)

    if (start >= end) {
      throw new BadRequestException('La fecha de entrada debe ser anterior a la de salida')
    }

    const isAvailable = await this.reservationRepository.checkAvailability(
      data.apartamentId,
      start,
      end,
    )

    if (!isAvailable) {
      throw new ConflictException('El apartamento no está disponible para las fechas seleccionadas')
    }

    return await this.reservationRepository.createReservation(data, userId)
  }
}
