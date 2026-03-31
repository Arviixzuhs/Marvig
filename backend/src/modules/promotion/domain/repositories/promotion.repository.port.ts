import { PromotionDto } from '@/modules/promotion/application/dto/promotion.dto'
import { PromotionPage } from '@/modules/promotion/application/dto/promotion-page.dto'
import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'
import { PromotionFilterDto } from '@/modules/promotion/application/dto/promotion-filter.dto'
import { UpdatePromotionDto } from '@/modules/promotion/application/dto/update-promotion.dto'

export interface PromotionRepositoryPort {
  findPromotion(promotionId: number): Promise<PromotionModel>
  findPromotions(filters: PromotionFilterDto): Promise<PromotionPage>
  createPromotion(promotion: PromotionDto): Promise<PromotionModel>
  deletePromotion(promotionId: number): Promise<void>
  existsById(promotionId: number): Promise<boolean>
  updatePromotion(promotionId: number, newData: UpdatePromotionDto): Promise<PromotionModel>
}
