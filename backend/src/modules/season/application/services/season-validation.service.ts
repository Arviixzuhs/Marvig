import { AdjustmentUnit } from '@/modules/season/domain/enums/adjustment-unit.enum'
import { PriceModifierType } from '@/modules/season/domain/enums/price-modifier-type.enum'
import { SeasonRepositoryPort } from '@/modules/season/domain/repositories/season.repository.port'
import { FindOverlappingSeasonsParams } from '@/modules/season/application/dto/find-overlapping-seasons-params.dto'
import {
  Inject,
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'

@Injectable()
export class SeasonValidationService {
  constructor(
    @Inject('SeasonRepository')
    private readonly seasonRepository: SeasonRepositoryPort,
  ) {}

  validateDateRange(startDate: Date, endDate: Date): void {
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Las fechas de la temporada no son válidas')
    }

    if (endDate < startDate) {
      throw new BadRequestException('La fecha de fin no puede ser anterior a la fecha de inicio')
    }
  }

  validateAdjustment(value: number, unit: AdjustmentUnit, action: PriceModifierType): void {
    if (value <= 0) {
      throw new BadRequestException('El valor del ajuste debe ser mayor a 0')
    }

    if (
      unit === AdjustmentUnit.PERCENTAGE &&
      action === PriceModifierType.DECREASE &&
      value > 100
    ) {
      throw new BadRequestException('Un descuento porcentual no puede ser mayor a 100%')
    }
  }

  async validateApartmentsExist(apartmentIds: number[]): Promise<void> {
    if (!apartmentIds.length) return

    const missingIds = await this.seasonRepository.findMissingApartmentIds(apartmentIds)

    if (missingIds.length) {
      throw new NotFoundException(
        `No se encontraron los apartamentos con id: ${missingIds.join(', ')}`,
      )
    }
  }

  /**
   * Dos temporadas ACTIVAS chocan si sus fechas se solapan (extremos incluidos)
   * y comparten alcance:
   *  - una temporada global (sin apartamentos) choca con cualquier otra
   *  - dos temporadas con apartamentos chocan solo si comparten al menos uno
   */
  async validateNoOverlap(params: FindOverlappingSeasonsParams): Promise<void> {
    const overlapping = await this.seasonRepository.findOverlappingSeasons(params)

    if (overlapping.length) {
      const names = overlapping.map((season) => `"${season.name}"`).join(', ')
      throw new ConflictException(`Las fechas se solapan con otras temporadas activas: ${names}`)
    }
  }
}
