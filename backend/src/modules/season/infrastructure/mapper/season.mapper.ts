import { Prisma } from 'generated/prisma/client'
import { BaseMapper } from '@/common/mappers/base.mapper'
import { SeasonType } from '@/modules/season/domain/enums/season-type.enum'
import { SeasonModel } from '@/modules/season/domain/models/season.model'
import { AdjustmentUnit } from '@/modules/season/domain/enums/adjustment-unit.enum'
import { PriceModifierType } from '@/modules/season/domain/enums/price-modifier-type.enum'

export type PrismaSeasonWithApartments = Prisma.SeasonGetPayload<{
  include: { apartments: { select: { id: true } } }
}>

export class SeasonMapper extends BaseMapper<PrismaSeasonWithApartments, SeasonModel> {
  modelToDomain(model: PrismaSeasonWithApartments): SeasonModel {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      startDate: model.startDate,
      endDate: model.endDate,
      value: model.value.toNumber(),
      unit: model.unit as AdjustmentUnit,
      action: model.action as PriceModifierType,
      type: model.type as SeasonType,
      isActive: model.isActive,
      apartmentIds: model.apartments.map((apartment) => apartment.id),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
