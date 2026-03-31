import { Prisma } from 'generated/prisma/client'

export interface PromotionSpecificationBuild {
  where: Prisma.PromotionWhereInput
  skip?: number
  take?: number
  orderBy?: Prisma.PromotionOrderByWithRelationInput
  include?: Prisma.PromotionInclude
}

export class PromotionSpecificationBuilder {
  private where: Prisma.PromotionWhereInput = { isDeleted: false }
  private skip?: number
  private take?: number
  private orderBy?: Prisma.PromotionOrderByWithRelationInput
  private include?: Prisma.PromotionInclude

  withName(name?: string) {
    if (name) {
      this.where.name = { contains: name, mode: 'insensitive' }
    }
    return this
  }

  withSearch(search?: string) {
    if (search && search.trim() !== '') {
      this.where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
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

  withPagination(page: number = 1, rowsPerPage: number = 10) {
    // Ajuste: Si tu sistema usa base 1 para páginas, restamos 1 para el skip de Prisma
    const currentPage = Math.max(1, page)
    this.skip = (currentPage - 1) * rowsPerPage
    this.take = rowsPerPage
    return this
  }

  withOrderBy(orderBy?: Prisma.PromotionOrderByWithRelationInput) {
    this.orderBy = orderBy || { createdAt: 'desc' }
    return this
  }

  withInclude(include: Prisma.PromotionInclude) {
    this.include = include
    return this
  }

  build(): PromotionSpecificationBuild {
    return {
      where: this.where,
      skip: this.skip,
      take: this.take,
      orderBy: this.orderBy,
      include: this.include,
    }
  }
}
