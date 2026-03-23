import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'
import { ApartamentRepositoryPort } from '@/modules/apartament/domain/repositories/apartament.repository.port'
import { Inject, Injectable, BadRequestException } from '@nestjs/common'

@Injectable()
export class FindAvailableApartamentsUseCase {
  constructor(
    @Inject('ApartamentRepository') private readonly apartamentRepository: ApartamentRepositoryPort,
  ) {}

  async execute(startDate: Date, endDate: Date): Promise<ApartamentModel[]> {
    if (startDate >= endDate) {
      throw new BadRequestException('The check-in date must be earlier than the check-out date')
    }

    return await this.apartamentRepository.findAvailable(startDate, endDate)
  }
}
