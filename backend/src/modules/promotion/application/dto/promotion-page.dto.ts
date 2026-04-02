import { PageType } from '@/common/dto/page-response.dto'
import { PromotionModel } from '@/modules/promotion/domain/models/promotion.model'

export class PromotionPage extends PageType(PromotionModel) {}
