import { SeasonModel } from '@/modules/season/domain/models/season.model'
import { CreateSeasonDto } from '@/modules/season/application/dto/create-season.dto'
import { Inject, Injectable } from '@nestjs/common'
import { SeasonRepositoryPort } from '@/modules/season/domain/repositories/season.repository.port'
import { SeasonValidationService } from '@/modules/season/application/services/season-validation.service'

@Injectable()
export class CreateSeasonUseCase {
  constructor(
    @Inject('SeasonRepository')
    private readonly seasonRepository: SeasonRepositoryPort,
    private readonly validation: SeasonValidationService,
  ) {}

  async execute(data: CreateSeasonDto): Promise<SeasonModel> {
    const unit = data.unit
    const action = data.action
    const isActive = data.isActive ?? true
    const apartmentIds = [...new Set(data.apartmentIds ?? [])]

    this.validation.validateDateRange(data.startDate, data.endDate)
    this.validation.validateAdjustment(data.value, unit, action)
    await this.validation.validateApartmentsExist(apartmentIds)

    if (isActive) {
      await this.validation.validateNoOverlap({
        startDate: data.startDate,
        endDate: data.endDate,
        apartmentIds,
      })
    }

    return this.seasonRepository.createSeason({ ...data, unit, action, isActive, apartmentIds })
  }
}
