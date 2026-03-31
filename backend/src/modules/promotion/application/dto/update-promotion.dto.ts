import { InputType, PartialType } from '@nestjs/graphql'
import { PromotionDto } from './promotion.dto'

@InputType()
export class UpdatePromotionDto extends PartialType(PromotionDto) {}
