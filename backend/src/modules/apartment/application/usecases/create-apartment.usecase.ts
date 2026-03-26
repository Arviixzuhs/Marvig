import { ApartmentDto } from '@/modules/apartment/application/dto/apartment.dto'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { ConflictException, Inject, Injectable } from '@nestjs/common'

@Injectable()
export class CreateApartmentUseCase {
  constructor(
    @Inject('ApartmentRepository') private readonly apartmentRepository: ApartmentRepositoryPort,
  ) {}

  async execute(data: ApartmentDto): Promise<ApartmentModel> {
    const existingApartment = await this.apartmentRepository.existsByNumber(data.number)
    if (existingApartment)
      throw new ConflictException('Apartment with the same number already exists')

    const createdApartment = await this.apartmentRepository.createApartment(data)
    return createdApartment
  }
}
