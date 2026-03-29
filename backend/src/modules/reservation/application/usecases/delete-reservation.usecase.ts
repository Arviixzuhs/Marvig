import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class DeleteReservationUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const existsReservation = await this.reservationRepository.existsById(id)
    if (!existsReservation) throw new NotFoundException('Reservation not found')

    await this.reservationRepository.deleteReservation(id)
  }
}
