import { ReservationDto } from '../dto/reservation.dto'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateReservationUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(id: number, newData: Partial<ReservationDto>): Promise<ReservationModel> {
    const existsReservation = await this.reservationRepository.existsById(id)
    if (!existsReservation) throw new NotFoundException('Reservation not found')

    return await this.reservationRepository.updateReservation(id, newData)
  }
}
