import { Prisma } from 'generated/prisma/client'
import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'

export interface ReservationSpecificationBuild {
  where: Prisma.ReservationWhereInput
  skip?: number
  take?: number
  orderBy?: Prisma.ReservationOrderByWithRelationInput
  include?: Prisma.ReservationInclude
}

export class ReservationSpecificationBuilder {
  private where: Prisma.ReservationWhereInput = {}
  private skip?: number
  private take?: number
  private orderBy?: Prisma.ReservationOrderByWithRelationInput
  private include?: Prisma.ReservationInclude

  withUserId(userId?: number) {
    if (userId) {
      this.where.userId = userId
    }
    return this
  }

  withApartmentId(apartmentId?: number) {
    if (apartmentId) {
      this.where.apartments.some = {
        id: apartmentId,
        isDeleted: false,
      }
    }
    return this
  }

  withStatus(status?: ReservationStatus) {
    if (status) {
      this.where.status = status
    }
    return this
  }

  withType(type?: RentalType) {
    if (type) {
      this.where.type = type
    }
    return this
  }

  withSearch(search?: string) {
    if (search !== undefined && search.trim() !== '') {
      this.where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ]
    }
    return this
  }

  withStayDates(startDate?: string, endDate?: string) {
    if (startDate || endDate) {
      this.where.AND = [
        ...(startDate ? [{ endDate: { gte: new Date(startDate) } }] : []),
        ...(endDate ? [{ startDate: { lte: new Date(endDate) } }] : []),
      ]
    }
    return this
  }

  withTotalPriceBetween(min?: number, max?: number) {
    if (min !== undefined || max !== undefined) {
      this.where.totalPrice = {
        ...(min !== undefined && { gte: min }),
        ...(max !== undefined && { lte: max }),
      }
    }
    return this
  }

  withIsDeleted(isDeleted?: boolean) {
    if (isDeleted !== undefined) {
      this.where.isDeleted = isDeleted
    }
    return this
  }

  withPagination(page: number = 0, pageSize: number = 10) {
    this.skip = page * pageSize
    this.take = pageSize
    return this
  }

  withOrderBy(orderBy?: Prisma.ReservationOrderByWithRelationInput) {
    if (orderBy) {
      this.orderBy = orderBy
    }
    return this
  }

  withInclude(include: Prisma.ReservationInclude) {
    this.include = include
    return this
  }

  build(): ReservationSpecificationBuild {
    return {
      where: this.where,
      skip: this.skip,
      take: this.take,
      orderBy: this.orderBy,
      include: this.include,
    }
  }
}
