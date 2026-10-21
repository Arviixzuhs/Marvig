import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { SeasonType } from '@/modules/season/domain/enums/season-type.enum'
import { AdjustmentUnit } from '@/modules/season/domain/enums/adjustment-unit.enum'
import { PriceModifierType } from '@/modules/season/domain/enums/price-modifier-type.enum'

@ObjectType('Season')
export class SeasonObjectType {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field()
  startDate: Date

  @Field()
  endDate: Date

  @Field(() => Float)
  value: number

  @Field(() => AdjustmentUnit)
  unit: AdjustmentUnit

  @Field(() => PriceModifierType)
  action: PriceModifierType

  @Field(() => SeasonType)
  type: SeasonType

  @Field()
  isActive: boolean

  @Field(() => [Int])
  apartmentIds?: number[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
