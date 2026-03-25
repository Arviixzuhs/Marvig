import { ReservationPage } from '@/modules/reservation/application/dto/reservation-page.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'

@Injectable()
export class FindReservationsUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(filters: ReservationFilterDto): Promise<ReservationPage> {
    return await this.reservationRepository.findReservations(filters)
  }
}
