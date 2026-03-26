import { ApartmentPage } from '@/modules/apartment/application/dto/apartment-page.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ApartmentFilterDto } from '@/modules/apartment/application/dto/apartment-filter.dto'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'

@Injectable()
export class FindApartmentsUseCase {
  constructor(
    @Inject('ApartmentRepository') private readonly apartmentRepository: ApartmentRepositoryPort,
  ) {}

  async execute(filters: ApartmentFilterDto): Promise<ApartmentPage> {
    return await this.apartmentRepository.findApartments(filters)
  }
}
