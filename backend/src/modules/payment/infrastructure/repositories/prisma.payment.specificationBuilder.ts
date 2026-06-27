import { Prisma } from 'generated/prisma/client'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaginateSpecificationBuilder } from '@/common/utils/paginate.specificationBuilder'

export interface PaymentSpecificationBuild {
  where: Prisma.PaymentWhereInput
  skip?: number
  take?: number
  orderBy?: Prisma.PaymentOrderByWithRelationInput
  include?: Prisma.PaymentInclude
}

export class PaymentSpecificationBuilder extends PaginateSpecificationBuilder {
  private where: Prisma.PaymentWhereInput = {}
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
      this.where.OR = [{ description: { contains: search } }, { reference: { contains: search } }]
    }
    return this
  }

  withStatus(status?: PaymentStatus | PaymentStatus[]) {
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

  withMethod(method?: PaymentMethod | PaymentMethod[]) {
    if (method) {
      if (Array.isArray(method)) {
        if (method.length > 0) {
          this.where.method = { in: method }
        }
      } else {
        this.where.method = method
      }
    }
    return this
  }

  withDateBetween(fromDate?: string, toDate?: string) {
    if (fromDate || toDate) {
      this.where.date = {
        ...(fromDate && { gte: new Date(fromDate) }),
        ...(toDate && { lte: new Date(toDate) }),
      }
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
