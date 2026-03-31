import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class PromotionType {
  @Field(() => Int)
  id: number

  @Field()
  name: string

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
