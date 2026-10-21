import { Prisma } from 'generated/prisma/client'
import { SeasonType } from '@/modules/season/domain/enums/season-type.enum'
import { AdjustmentUnit } from '@/modules/season/domain/enums/adjustment-unit.enum'
import { PriceModifierType } from '@/modules/season/domain/enums/price-modifier-type.enum'
import { PaginateSpecificationBuilder } from '@/common/utils/paginate.specificationBuilder'

export interface SeasonSpecificationBuild {
  where: Prisma.SeasonWhereInput
  skip?: number
  take?: number
  orderBy?: Prisma.SeasonOrderByWithRelationInput
}

export class SeasonSpecificationBuilder extends PaginateSpecificationBuilder {
  private where: Prisma.SeasonWhereInput = { isDeleted: false }
  private orderBy?: Prisma.SeasonOrderByWithRelationInput

  withName(name?: string) {
    if (name) {
      this.where.name = { contains: name, mode: 'insensitive' }
    }
    return this
  }

  withTypes(types?: SeasonType[]) {
    if (types?.length) {
      this.where.type = { in: types }
    }
    return this
  }

  withUnits(units?: AdjustmentUnit[]) {
    if (units?.length) {
      this.where.unit = { in: units }
    }
    return this
  }

  withActions(actions?: PriceModifierType[]) {
    if (actions?.length) {
      this.where.action = { in: actions }
    }
    return this
  }

  withIsActive(isActive?: boolean) {
    if (isActive !== undefined && isActive !== null) {
      this.where.isActive = isActive
    }
    return this
  }

  withApartmentId(apartmentId?: number) {
    if (apartmentId) {
      this.where.apartments = { some: { id: apartmentId } }
    }
    return this
  }

  /** Temporadas que se solapan con el rango [fromDate, toDate] */
  withDateOverlap(fromDate?: string, toDate?: string) {
    if (fromDate) {
      this.where.endDate = { gte: new Date(fromDate) }
    }
    if (toDate) {
      this.where.startDate = { lte: new Date(toDate) }
    }
    return this
  }

  withOrderBy(orderBy?: Prisma.SeasonOrderByWithRelationInput) {
    if (orderBy) {
      this.orderBy = orderBy
    }
    return this
  }

  build(): SeasonSpecificationBuild {
    return {
      where: this.where,
      skip: this.skip,
      take: this.take,
      orderBy: this.orderBy,
    }
  }
}
