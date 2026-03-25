import { Prisma } from 'generated/prisma/client'

export interface EmployeeSpecificationBuild {
  where: Prisma.EmployeeWhereInput
  skip?: number
  take?: number
  orderBy?: Prisma.EmployeeOrderByWithRelationInput
}

export class EmployeeSpecificationBuilder {
  private where: Prisma.EmployeeWhereInput = {}
  private skip?: number
  private take?: number
  private orderBy?: Prisma.EmployeeOrderByWithRelationInput

  withName(name?: string) {
    if (name) {
      this.where.name = { contains: name }
    }
    return this
  }

  withSearch(search?: string) {
    if (search !== undefined && search.trim() !== '') {
      this.where.OR = [
        { lastName: { contains: search } },
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ]
    }
    return this
  }

  withLastName(lastName?: string) {
    if (lastName) {
      this.where.lastName = { contains: lastName }
    }
    return this
  }

  withEmail(email?: string) {
    if (email) {
      this.where.email = { contains: email }
    }
    return this
  }

  withPhone(phone?: string) {
    if (phone) {
      this.where.phone = { contains: phone }
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

  withIsDeleted(isDeleted?: boolean) {
    if (isDeleted !== undefined) {
      this.where.isDeleted = isDeleted
    }
    return this
  }

  withPagination(page: number = 1, pageSize: number = 10) {
    this.skip = page * pageSize
    this.take = pageSize
    return this
  }

  withOrderBy(orderBy?: Prisma.EmployeeOrderByWithRelationInput) {
    if (orderBy) {
      this.orderBy = orderBy
    }
    return this
  }

  build(): EmployeeSpecificationBuild {
    return {
      where: this.where,
      skip: this.skip,
      take: this.take,
      orderBy: this.orderBy,
    }
  }
}
