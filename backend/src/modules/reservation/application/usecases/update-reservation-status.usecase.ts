import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateReservationStatusUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(id: number, status: ReservationStatus): Promise<ReservationModel> {
    const existsReservation = await this.reservationRepository.existsById(id)
    if (!existsReservation) throw new NotFoundException('Reservation not found')

    return await this.reservationRepository.updateStatus(id, status)
  }
}
