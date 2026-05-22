import { InputType, PartialType } from '@nestjs/graphql'
import { CreatePromotionInput } from './create-promotion.input'

@InputType()
export class UpdatePromotionInput extends PartialType(CreatePromotionInput) {}
