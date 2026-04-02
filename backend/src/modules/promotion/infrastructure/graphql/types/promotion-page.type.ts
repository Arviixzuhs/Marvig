import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { PromotionType } from '@/modules/promotion/infrastructure/graphql/types/promotion.type'

@ObjectType()
export class PromotionPageType extends PageType(PromotionType) {}
