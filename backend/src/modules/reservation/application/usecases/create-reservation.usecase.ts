import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { CreateReservationDto } from '@/modules/reservation/application/dto/create-reservation.dto'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { Inject, Injectable, ConflictException, BadRequestException } from '@nestjs/common'

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,

    @Inject('ApartmentRepository')
    private readonly apartmentRepository: ApartmentRepositoryPort,
  ) {}

  async execute(data: CreateReservationDto, userId?: number): Promise<ReservationModel> {
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)

    if (start >= end) {
      throw new BadRequestException('La fecha de entrada debe ser anterior a la de salida')
    }

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const apartments = await this.apartmentRepository.findApartments({
      ids: data.apartmentIds,
    })

    if (apartments.content.length !== data.apartmentIds.length) {
      throw new BadRequestException('Algunos de los apartamentos no existen')
    }

    const isAvailable = await this.reservationRepository.checkAvailability(
      data.apartmentIds,
      start,
      end,
    )

    if (!isAvailable) {
      throw new ConflictException('Uno o más apartamentos no están disponibles')
    }

    const calculatedTotal = apartments.content.reduce((acc, apartment) => {
      let pricePerDay = Number(apartment.pricePerDay)
      let discount = 0

      if (apartment.promotion) {
        const promoValue = Number(apartment.promotion.value)

        if (apartment.promotion.type === 'PERCENTAGE') {
          discount = (pricePerDay * promoValue) / 100
        } else {
          discount = promoValue
        }
      }

      const finalPricePerDay = pricePerDay - discount
      return acc + finalPricePerDay * diffDays
    }, 0)

    const finalTotal = Math.round(calculatedTotal * 100) / 100

    if (Math.abs(finalTotal - data.totalPrice) > 0.01) {
      throw new BadRequestException(
        `Discrepancia de precio: Calculado ${finalTotal} vs Enviado ${data.totalPrice}`,
      )
    }

    return await this.reservationRepository.createReservation(
      {
        ...data,
        totalPrice: finalTotal,
      },
      userId,
    )
  }
}
