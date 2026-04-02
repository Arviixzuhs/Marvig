import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { PromotionType as PromotionTypeEnum } from 'generated/prisma/enums'

@ObjectType()
export class PromotionType {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  type: PromotionTypeEnum

  @Field(() => Float)
  value: number

  @Field({ nullable: true })
  description?: string | null

  @Field({ nullable: true })
  isDeleted?: boolean | null

  @Field({ nullable: true })
  createdAt?: Date | null

  @Field({ nullable: true })
  updatedAt?: Date | null

  @Field({ nullable: true })
  deletedAt?: Date | null
}
