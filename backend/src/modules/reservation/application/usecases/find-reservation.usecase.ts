import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class FindReservationUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(id: number): Promise<ReservationModel> {
    const reservation = await this.reservationRepository.findReservationById(id)
    if (!reservation) throw new NotFoundException('Reservation not found')

    return reservation
  }
}
