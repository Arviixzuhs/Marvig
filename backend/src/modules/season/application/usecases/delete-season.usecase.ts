import { SeasonRepositoryPort } from '@/modules/season/domain/repositories/season.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class DeleteSeasonUseCase {
  constructor(
    @Inject('SeasonRepository')
    private readonly seasonRepository: SeasonRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const season = await this.seasonRepository.findSeasonById(id)

    if (!season) {
      throw new NotFoundException(`La temporada con id ${id} no existe`)
    }

    await this.seasonRepository.softDeleteSeason(id)
  }
}
