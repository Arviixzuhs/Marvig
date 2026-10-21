import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { calcTotalByApartmentsAndDates } from '@/common/utils/calc-total-by-apartments.util'
import { SeasonRepositoryPort } from '@/modules/season/domain/repositories/season.repository.port'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { CalculateReservationTotalDto } from '@/modules/reservation/application/dto/calculate-reservation-total.dto'

@Injectable()
export class CalculateReservationTotalUseCase {
  constructor(
    @Inject('ApartmentRepository')
    private readonly apartmentRepository: ApartmentRepositoryPort,

    @Inject('SeasonRepository')
    private readonly seasonRepository: SeasonRepositoryPort,
  ) {}

  async execute(data: CalculateReservationTotalDto): Promise<number> {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)

    if (start >= end) {
      throw new BadRequestException('La fecha de entrada debe ser anterior a la de salida')
    }

    const apartments = await this.apartmentRepository.findApartments({ ids: data.apartmentIds })

    if (apartments.content.length !== data.apartmentIds.length) {
      throw new NotFoundException('Algunos de los apartamentos no existen')
    }

    const seasons = await this.seasonRepository.findOverlappingSeasons({
      startDate: start,
      endDate: end,
      apartmentIds: data.apartmentIds,
    })

    return calcTotalByApartmentsAndDates({
      startDate: start,
      endDate: end,
      apartments: apartments.content,
      seasons,
    })
  }
}
