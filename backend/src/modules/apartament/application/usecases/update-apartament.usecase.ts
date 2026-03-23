import { ApartmentDto } from '@/modules/apartament/application/dto/apartament.dto'
import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'
import { ApartamentRepositoryPort } from '@/modules/apartament/domain/repositories/apartament.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateApartamentUseCase {
  constructor(
    @Inject('ApartamentRepository') private readonly apartamentRepository: ApartamentRepositoryPort,
  ) {}

  async execute(id: number, newData: Partial<ApartmentDto>): Promise<ApartamentModel> {
    const apartament = await this.apartamentRepository.findApartament(id)
    if (!apartament) throw new NotFoundException('Apartament not found')

    return await this.apartamentRepository.updateApartament(id, newData)
  }
}
