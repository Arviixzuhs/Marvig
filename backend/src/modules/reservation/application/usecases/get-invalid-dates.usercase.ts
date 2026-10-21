import { InvalidDateResponseDto } from '@/modules/reservation/application/dto/invalid-date.dto'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class GetInvalidDatesUseCase {
  constructor(
    @Inject('ApartmentRepository')
    private readonly apartmentRepository: ApartmentRepositoryPort,

    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(
    apartmentIds: number[],
    reserveIdToExclude?: number,
  ): Promise<InvalidDateResponseDto[]> {
    const apartments = await this.apartmentRepository.findApartments({
      ids: apartmentIds,
    })

    if (apartments.content.length !== apartmentIds.length) {
      throw new NotFoundException('Algunos de los apartamentos no existen')
    }

    const reservations = await this.reservationRepository.findAvailableReservations(
      apartmentIds,
      reserveIdToExclude,
    )

    const invalidDates: InvalidDateResponseDto[] = []

    for (const reservation of reservations) {
      // Instanciar asegurando la referencia temporal
      const current = new Date(reservation.startDate)
      const end = new Date(reservation.endDate)

      // Recorrer noche a noche en UTC estrictamente (< para no incluir la fecha/día de checkout)
      while (current < end) {
        invalidDates.push({
          year: current.getUTCFullYear().toString(),
          month: (current.getUTCMonth() + 1).toString().padStart(2, '0'),
          day: current.getUTCDate().toString().padStart(2, '0'),
        })

        // Avanzar exactamente 1 día en UTC
        current.setUTCDate(current.getUTCDate() + 1)
      }
    }

    return invalidDates
  }
}
