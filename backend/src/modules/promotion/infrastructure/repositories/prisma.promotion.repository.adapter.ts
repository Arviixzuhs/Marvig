import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { PromotionPage } from '@/modules/promotion/application/dto/promotion-page.dto'
import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'
import { PromotionMapper } from '@/modules/promotion/infrastructure/mappers/promotion.mapper'
import { UpdatePromotionDto } from '@/modules/promotion/application/dto/update-promotion.dto'
import { PromotionFilterDto } from '@/modules/promotion/application/dto/promotion-filter.dto'
import { PromotionRepositoryPort } from '@/modules/promotion/domain/repositories/promotion.repository.port'
import { PromotionSpecificationBuilder } from './prisma.promotion.specificationBuilder'

@Injectable()
export class PrismaPromotionRepositoryAdapter implements PromotionRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  private readonly promotionMapper = new PromotionMapper()

  async createPromotion(data: PromotionModel): Promise<PromotionModel> {
    const createdPromotion = await this.prisma.promotion.create({
      data: {
        type: data.type,
        value: data.value,
        name: data.name,
        description: data.description,
      },
    })

    return this.promotionMapper.modelToDomain(createdPromotion)
  }

  async findPromotions(filters: PromotionFilterDto): Promise<PromotionPage> {
    const builder = new PromotionSpecificationBuilder()
      .withSearch(filters.search)
      .withName(filters.name)
      .withCreatedAtBetween(filters.fromDate, filters.toDate)
      .withPagination(filters.page, filters.pageSize)
      .withOrderBy({ createdAt: 'desc' })
      .build()

    const [promotions, totalItems] = await this.prisma.$transaction([
      this.prisma.promotion.findMany(builder),
      this.prisma.promotion.count({ where: builder.where }),
    ])

    const rowsPerPage = builder.take || 10

    return {
      content: this.promotionMapper.modelsToDomain(promotions),
      totalItems,
      totalPages: Math.ceil(totalItems / rowsPerPage),
      currentPage: filters.page,
      rowsPerPage: rowsPerPage,
    }
  }

  async deletePromotion(promotionId: number): Promise<void> {
    await this.prisma.promotion.update({
      where: { id: promotionId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })
  }

  async updatePromotion(promotionId: number, newData: UpdatePromotionDto): Promise<PromotionModel> {
    const updatedPromotion = await this.prisma.promotion.update({
      where: { id: promotionId },
      data: newData,
    })
    return this.promotionMapper.modelToDomain(updatedPromotion)
  }

  async existsById(id: number): Promise<boolean> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      select: { id: true },
    })
    return !!promotion
  }

  async findPromotion(promotionId: number): Promise<PromotionModel> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId },
    })

    return this.promotionMapper.modelToDomain(promotion)
  }
}
