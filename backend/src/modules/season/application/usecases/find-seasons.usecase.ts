import { SeasonPage } from '@/modules/season/application/dto/season-page.dto'
import { SeasonFilterDto } from '@/modules/season/application/dto/season-filter.dto'
import { Inject, Injectable } from '@nestjs/common'
import { SeasonRepositoryPort } from '@/modules/season/domain/repositories/season.repository.port'

@Injectable()
export class FindSeasonsUseCase {
  constructor(
    @Inject('SeasonRepository')
    private readonly seasonRepository: SeasonRepositoryPort,
  ) {}

  execute(filters: SeasonFilterDto): Promise<SeasonPage> {
    return this.seasonRepository.findSeasons(filters)
  }
}
