import { SeasonModel } from '@/modules/season/domain/models/season.model'
import { UpdateSeasonDto } from '@/modules/season/application/dto/update-season.dto'
import { SeasonRepositoryPort } from '@/modules/season/domain/repositories/season.repository.port'
import { SeasonValidationService } from '@/modules/season/application/services/season-validation.service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateSeasonUseCase {
  constructor(
    @Inject('SeasonRepository')
    private readonly seasonRepository: SeasonRepositoryPort,
    private readonly validation: SeasonValidationService,
  ) {}

  async execute({ id, ...changes }: UpdateSeasonDto): Promise<SeasonModel> {
    const current = await this.seasonRepository.findSeasonById(id)

    if (!current) {
      throw new NotFoundException('Temporada no encontrada')
    }

    // Estado final de la temporada tras aplicar los cambios
    const startDate = changes.startDate ?? current.startDate
    const endDate = changes.endDate ?? current.endDate
    const value = changes.value ?? current.value
    const unit = changes.unit ?? current.unit
    const action = changes.action ?? current.action
    const isActive = changes.isActive ?? current.isActive
    const apartmentIds = changes.apartmentIds
      ? [...new Set(changes.apartmentIds)]
      : current.apartmentIds

    this.validation.validateDateRange(startDate, endDate)
    this.validation.validateAdjustment(value, unit, action)

    if (changes.apartmentIds) {
      await this.validation.validateApartmentsExist(apartmentIds)
    }

    // Solo una temporada activa puede chocar (incluye el caso de reactivar una inactiva)
    if (isActive) {
      await this.validation.validateNoOverlap({ startDate, endDate, apartmentIds, excludeId: id })
    }

    return this.seasonRepository.updateSeason(id, {
      ...changes,
      apartmentIds: changes.apartmentIds ? apartmentIds : undefined,
    })
  }
}
