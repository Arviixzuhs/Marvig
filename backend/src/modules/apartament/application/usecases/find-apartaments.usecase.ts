import { ApartamentPage } from '@/modules/apartament/application/dto/apartament-page.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ApartamentFilterDto } from '@/modules/apartament/application/dto/apartament-filter.dto'
import { ApartamentRepositoryPort } from '@/modules/apartament/domain/repositories/apartament.repository.port'

@Injectable()
export class FindApartamentsUseCase {
  constructor(
    @Inject('ApartamentRepository') private readonly apartamentRepository: ApartamentRepositoryPort,
  ) {}

  async execute(filters: ApartamentFilterDto): Promise<ApartamentPage> {
    return await this.apartamentRepository.findApartaments(filters)
  }
}
