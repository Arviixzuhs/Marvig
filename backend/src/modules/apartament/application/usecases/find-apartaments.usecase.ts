import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'
import { ApartamentRepositoryPort } from '@/modules/apartament/domain/repositories/apartament.repository.port'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class FindApartamentsUseCase {
  constructor(
    @Inject('ApartamentRepository') private readonly apartamentRepository: ApartamentRepositoryPort,
  ) {}

  async execute(): Promise<ApartamentModel[]> {
    return await this.apartamentRepository.findApartaments()
  }
}
