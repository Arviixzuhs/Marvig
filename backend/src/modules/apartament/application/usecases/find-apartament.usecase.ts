import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'
import { ApartamentRepositoryPort } from '@/modules/apartament/domain/repositories/apartament.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class FindApartamentUseCase {
  constructor(
    @Inject('ApartamentRepository') private readonly apartamentRepository: ApartamentRepositoryPort,
  ) {}

  async execute(id: number): Promise<ApartamentModel> {
    const apartament = await this.apartamentRepository.findApartament(id)

    if (!apartament) throw new NotFoundException('Apartament not found')

    return apartament
  }
}
