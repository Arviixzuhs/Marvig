import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class FindApartmentUseCase {
  constructor(
    @Inject('ApartmentRepository') private readonly apartmentRepository: ApartmentRepositoryPort,
  ) {}

  async execute(id: number): Promise<ApartmentModel> {
    const apartment = await this.apartmentRepository.findApartment(id)

    if (!apartment) throw new NotFoundException('Apartment not found')

    return apartment
  }
}
