import { Prisma } from 'generated/prisma/client'

export interface UserSpecificationBuild {
  where: Prisma.UserWhereInput
  skip?: number
  take?: number
  orderBy?: Prisma.UserOrderByWithRelationInput
  include?: Prisma.UserInclude
}

export class UserSpecificationBuilder {
  private where: Prisma.UserWhereInput = {}
  private skip?: number
  private take?: number
  private orderBy?: Prisma.UserOrderByWithRelationInput
  private include?: Prisma.UserInclude

  withName(name?: string) {
    if (name) {
      this.where.name = { contains: name, mode: 'insensitive' }
    }
    return this
  }

  withEmail(email?: string) {
    if (email) {
      this.where.email = { contains: email, mode: 'insensitive' }
    }
    return this
  }

  withSearch(search?: string) {
    if (search && search.trim() !== '') {
      this.where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    return this
  }

  withCreatedAtBetween(fromDate?: string, toDate?: string) {
    if (fromDate || toDate) {
      this.where.createdAt = {
        ...(fromDate && { gte: new Date(fromDate) }),
        ...(toDate && { lte: new Date(toDate) }),
      }
    }
    return this
  }

  withPagination(page: number = 0, pageSize: number = 10) {
    this.skip = page * pageSize
    this.take = pageSize
    return this
  }

  withOrderBy(orderBy?: Prisma.UserOrderByWithRelationInput) {
    this.orderBy = orderBy || { createdAt: 'desc' }
    return this
  }

  withInclude(include: Prisma.UserInclude) {
    this.include = include
    return this
  }

  build(): UserSpecificationBuild {
    return {
      where: this.where,
      skip: this.skip,
      take: this.take,
      orderBy: this.orderBy,
      include: this.include,
    }
  }
}
