import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { Prisma } from 'generated/prisma/client'
import { ExpenseCategory } from 'generated/prisma/client'

export interface ExpenseSpecificationBuild {
  where: Prisma.ExpenseWhereInput
  skip?: number
  take?: number
  orderBy?: Prisma.ExpenseOrderByWithRelationInput
}

export class ExpenseSpecificationBuilder {
  private where: Prisma.ExpenseWhereInput = {}
  private skip?: number
  private take?: number
  private orderBy?: Prisma.ExpenseOrderByWithRelationInput

  withSearch(search?: string) {
    if (search !== undefined && search.trim() !== '') {
      this.where.description = {
        contains: search,
        mode: 'insensitive',
      }
    }
    return this
  }

  withApartment(apartmentId?: number) {
    if (apartmentId) {
      this.where.apartmentId = apartmentId
    }
    return this
  }

  withEmployee(employeeId?: number) {
    if (employeeId) {
      this.where.employeeId = employeeId
    }
    return this
  }

  withCategory(category?: ExpenseCategory | ExpenseCategory[]) {
    if (category) {
      if (Array.isArray(category)) {
        if (category.length > 0) {
          this.where.category = { in: category }
        }
      } else {
        this.where.category = category
      }
    }
    return this
  }

  withPaymentMethod(paymentMethod: PaymentMethod | PaymentMethod[]) {
    if (paymentMethod) {
      if (Array.isArray(paymentMethod)) {
        if (paymentMethod.length > 0) {
          this.where.paymentMethod = { in: paymentMethod }
        }
      } else {
        this.where.paymentMethod = paymentMethod
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

  withAmountBetween(min?: number, max?: number) {
    if (min !== undefined || max !== undefined) {
      this.where.amount = {
        ...(min !== undefined && { gte: min }),
        ...(max !== undefined && { lte: max }),
      }
    }
    return this
  }

  withDateBetween(fromDate?: string, toDate?: string) {
    if (fromDate || toDate) {
      this.where.createdAt = {
        ...(fromDate && { gte: new Date(fromDate) }),
        ...(toDate && { lte: new Date(toDate) }),
      }
    }
    return this
  }

  withPagination(page: number = 0, pageSize: number = 10, isUnpaged: boolean = false) {
    if (isUnpaged) {
      this.skip = undefined
      this.take = undefined
    } else {
      this.skip = page * pageSize
      this.take = pageSize
    }
    return this
  }

  withOrderBy(orderBy?: Prisma.ExpenseOrderByWithRelationInput) {
    if (orderBy) {
      this.orderBy = orderBy
    }
    return this
  }

  build(): ExpenseSpecificationBuild {
    return {
      where: this.where,
      skip: this.skip,
      take: this.take,
      orderBy: this.orderBy,
    }
  }
}
