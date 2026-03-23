import { ApartmentDto } from '@/modules/apartament/application/dto/apartament.dto'
import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'
import { ApartamentRepositoryPort } from '@/modules/apartament/domain/repositories/apartament.repository.port'
import { ConflictException, Inject, Injectable } from '@nestjs/common'

@Injectable()
export class CreateApartamentUseCase {
  constructor(
    @Inject('ApartamentRepository') private readonly apartamentRepository: ApartamentRepositoryPort,
  ) {}

  async execute(data: ApartmentDto): Promise<ApartamentModel> {
    const existingApartament = await this.apartamentRepository.existsByNumber(data.number)
    if (existingApartament)
      throw new ConflictException('Apartament with the same number already exists')

    const createdApartament = await this.apartamentRepository.createApartament(data)
    return createdApartament
  }
}
