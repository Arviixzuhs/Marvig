import { Prisma } from 'generated/prisma/client'

export interface PaymentSpecificationBuild {
  where: Prisma.PaymentWhereInput
  skip?: number
  take?: number
  orderBy?: Prisma.PaymentOrderByWithRelationInput
  include?: Prisma.PaymentInclude
}

export class PaymentSpecificationBuilder {
  private where: Prisma.PaymentWhereInput = {}
  private skip?: number
  private take?: number
  private orderBy?: Prisma.PaymentOrderByWithRelationInput
  private include?: Prisma.PaymentInclude

  withReservationId(reservationId?: number) {
    if (reservationId) {
      this.where.reservationId = reservationId
    }
    return this
  }

  withSearch(search?: string) {
    if (search && search.trim() !== '') {
      this.where.description = { contains: search, mode: 'insensitive' }
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

  withOrderBy(orderBy?: Prisma.PaymentOrderByWithRelationInput) {
    this.orderBy = orderBy || { createdAt: 'desc' }
    return this
  }

  withInclude(include: Prisma.PaymentInclude) {
    this.include = include
    return this
  }

  build(): PaymentSpecificationBuild {
    return {
      where: this.where,
      skip: this.skip,
      take: this.take,
      orderBy: this.orderBy,
      include: this.include,
    }
  }
}
