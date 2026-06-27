import { Prisma } from 'generated/prisma/client'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { PaginateSpecificationBuilder } from '@/common/utils/paginate.specificationBuilder'

export interface ApartmentSpecificationBuild {
  where: Prisma.ApartmentWhereInput
  skip?: number
  take?: number
  orderBy?: Prisma.ApartmentOrderByWithRelationInput
  include?: Prisma.ApartmentInclude
}

export class ApartmentSpecificationBuilder extends PaginateSpecificationBuilder {
  private where: Prisma.ApartmentWhereInput = {}
  private orderBy?: Prisma.ApartmentOrderByWithRelationInput
  private include?: Prisma.ApartmentInclude

  withNumber(number?: string) {
    if (number) {
      this.where.number = { contains: number, mode: 'insensitive' }
    }
    return this
  }

  withSearch(search?: string) {
    if (search !== undefined && search.trim() !== '') {
      this.where.OR = [{ number: { contains: search, mode: 'insensitive' } }]
    }
    return this
  }

  withFloor(floor?: number) {
    if (floor !== undefined) {
      this.where.floor = floor
    }
    return this
  }

  withStatus(status?: ApartmentStatusEnum | ApartmentStatusEnum[]) {
    if (status) {
      if (Array.isArray(status)) {
        if (status.length > 0) {
          this.where.status = { in: status }
        }
      } else {
        this.where.status = status
      }
    }
    return this
  }

  withIds(ids?: number[]) {
    if (ids && ids.length > 0) {
      this.where.id = { in: ids }
    }
    return this
  }

  withRooms(bedrooms?: number, bathrooms?: number) {
    if (bedrooms !== undefined) {
      this.where.bedrooms = { gte: bedrooms }
    }
    if (bathrooms !== undefined) {
      this.where.bathrooms = { gte: bathrooms }
    }
    return this
  }

  withPricePerDayBetween(min?: number, max?: number) {
    if (min !== undefined || max !== undefined) {
      this.where.pricePerDay = {
        ...(min !== undefined && { gte: min }),
        ...(max !== undefined && { lte: max }),
      }
    }
    return this
  }

  withSquareMetersBetween(min?: number, max?: number) {
    if (min !== undefined || max !== undefined) {
      this.where.squareMeters = {
        ...(min !== undefined && { gte: min }),
        ...(max !== undefined && { lte: max }),
      }
    }
    return this
  }

  withValidDate(fromDate?: string, toDate?: string) {
    if (!fromDate || !toDate) return this

    this.where.reservations = {
      none: {
        isDeleted: false,
        status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.PENDING] },
        AND: [
          {
            OR: [
              {
                startDate: { lte: fromDate },
                endDate: { gt: fromDate },
              },
              {
                startDate: { lt: toDate },
                endDate: { gte: toDate },
              },
              {
                startDate: { gte: fromDate },
                endDate: { lte: toDate },
              },
            ],
          },
        ],
      },
    }
    return this
  }

  withIsDeleted(isDeleted: boolean = false) {
    this.where.isDeleted = isDeleted
    return this
  }

  withOrderBy(orderBy?: Prisma.ApartmentOrderByWithRelationInput) {
    this.orderBy = orderBy || { number: 'asc' }
    return this
  }

  withInclude(include: Prisma.ApartmentInclude) {
    this.include = include
    return this
  }

  build(): ApartmentSpecificationBuild {
    return {
      where: this.where,
      skip: this.skip,
      take: this.take,
      orderBy: this.orderBy,
      include: this.include,
    }
  }
}
