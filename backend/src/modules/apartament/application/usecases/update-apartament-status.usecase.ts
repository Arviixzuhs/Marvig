import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'
import { ApartmentStatus } from 'generated/prisma/enums'
import { ApartamentRepositoryPort } from '@/modules/apartament/domain/repositories/apartament.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateApartamentStatusUseCase {
  constructor(
    @Inject('ApartamentRepository') private readonly apartamentRepository: ApartamentRepositoryPort,
  ) {}

  async execute(id: number, status: ApartmentStatus): Promise<ApartamentModel> {
    const apartament = await this.apartamentRepository.findApartament(id)
    if (!apartament) throw new NotFoundException('Apartament not found')

    return await this.apartamentRepository.updateStatus(id, status)
  }
}
