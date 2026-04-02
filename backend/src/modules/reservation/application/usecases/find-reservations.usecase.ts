import { Inject, Injectable } from '@nestjs/common'
import { ReservationPageType } from '@/modules/reservation/infrastructure/graphql/types/reservation-page.type'
import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'

@Injectable()
export class FindReservationsUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(filters: ReservationFilterDto): Promise<ReservationPageType> {
    return await this.reservationRepository.findReservations(filters)
  }
}
