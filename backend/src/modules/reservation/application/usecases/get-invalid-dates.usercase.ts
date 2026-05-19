import { InvalidDateResponseDto } from '@/modules/reservation/application/dto/invalid-date.dto'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class GetInvalidDatesUseCase {
  constructor(
    @Inject('ApartmentRepository') private readonly apartmentRepository: ApartmentRepositoryPort,
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(apartmentId: number): Promise<InvalidDateResponseDto[]> {
    const existingApartment = await this.apartmentRepository.existsById(apartmentId)
    if (!existingApartment) {
      throw new NotFoundException('Apartment not found')
    }

    const reservations = await this.reservationRepository.findByApartmentId(apartmentId)

    const invalidDates = []

    for (const reservation of reservations) {
      const current = new Date(reservation.startDate)
      const end = new Date(reservation.endDate)

      while (current <= end) {
        invalidDates.push({
          year: current.getFullYear().toString(),
          month: (current.getMonth() + 1).toString().padStart(2, '0'),
          day: current.getDate().toString().padStart(2, '0'),
        })

        current.setDate(current.getDate() + 1)
      }
    }

    return invalidDates
  }
}
