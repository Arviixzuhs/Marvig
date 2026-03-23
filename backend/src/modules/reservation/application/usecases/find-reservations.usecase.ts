import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { Inject, Injectable } from '@nestjs/common'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'

@Injectable()
export class FindReservationsUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(): Promise<ReservationModel[]> {
    return await this.reservationRepository.findReservations()
  }
}
