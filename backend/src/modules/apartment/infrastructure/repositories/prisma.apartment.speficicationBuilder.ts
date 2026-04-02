import { Prisma, ApartmentStatus } from 'generated/prisma/client'

export interface ApartmentSpecificationBuild {
  where: Prisma.ApartmentWhereInput
  skip?: number
  take?: number
  orderBy?: Prisma.ApartmentOrderByWithRelationInput
  include?: Prisma.ApartmentInclude
}

export class ApartmentSpecificationBuilder {
  private where: Prisma.ApartmentWhereInput = {}
  private skip?: number
  private take?: number
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

  withStatus(status?: ApartmentStatus) {
    if (status) {
      this.where.status = status
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

  withSquareMetersBetween(min?: number, max?: number) {
    if (min !== undefined || max !== undefined) {
      this.where.squareMeters = {
        ...(min !== undefined && { gte: min }),
        ...(max !== undefined && { lte: max }),
      }
    }
    return this
  }

  withIsDeleted(isDeleted: boolean = false) {
    this.where.isDeleted = isDeleted
    return this
  }

  withPagination(page: number = 0, pageSize: number = 10) {
    this.skip = page * pageSize
    this.take = pageSize
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
