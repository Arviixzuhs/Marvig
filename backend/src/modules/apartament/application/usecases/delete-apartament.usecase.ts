import { ApartamentRepositoryPort } from '@/modules/apartament/domain/repositories/apartament.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class DeleteApartamentUseCase {
  constructor(
    @Inject('ApartamentRepository') private readonly apartamentRepository: ApartamentRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const apartament = await this.apartamentRepository.findApartament(id)

    if (!apartament) throw new NotFoundException('Apartament not found')

    await this.apartamentRepository.deleteApartament(id)
  }
}
