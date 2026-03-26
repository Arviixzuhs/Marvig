import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class DeleteApartmentUseCase {
  constructor(
    @Inject('ApartmentRepository') private readonly apartmentRepository: ApartmentRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const apartment = await this.apartmentRepository.findApartment(id)

    if (!apartment) throw new NotFoundException('Apartment not found')

    await this.apartmentRepository.deleteApartment(id)
  }
}
