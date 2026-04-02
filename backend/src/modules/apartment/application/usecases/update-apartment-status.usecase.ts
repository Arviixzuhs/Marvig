import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateApartmentStatusUseCase {
  constructor(
    @Inject('ApartmentRepository') private readonly apartmentRepository: ApartmentRepositoryPort,
  ) {}

  async execute(id: number, status: ApartmentStatusEnum): Promise<ApartmentModel> {
    const apartment = await this.apartmentRepository.existsById(id)
    if (!apartment) throw new NotFoundException('Apartment not found')

    return await this.apartmentRepository.updateStatus(id, status)
  }
}
