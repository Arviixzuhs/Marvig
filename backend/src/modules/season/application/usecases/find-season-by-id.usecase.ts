import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { SeasonModel } from '@/modules/season/domain/models/season.model'
import { SeasonRepositoryPort } from '@/modules/season/domain/repositories/season.repository.port'

@Injectable()
export class FindSeasonByIdUseCase {
  constructor(
    @Inject('SeasonRepository')
    private readonly seasonRepository: SeasonRepositoryPort,
  ) {}

  async execute(id: number): Promise<SeasonModel> {
    const season = await this.seasonRepository.findSeasonById(id)

    if (!season) {
      throw new NotFoundException(`La temporada con id ${id} no existe`)
    }

    return season
  }
}
