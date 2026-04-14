import { ObjectType, Field, Float } from '@nestjs/graphql'

@ObjectType()
export class ExpensePerformanceType {
  @Field()
  month: string

  @Field(() => Float)
  MAINTENANCE: number

  @Field(() => Float)
  UTILITIES: number

  @Field(() => Float)
  CLEANING: number

  @Field(() => Float)
  TAXES: number

  @Field(() => Float)
  SUPPLIES: number

  @Field(() => Float)
  OTHER: number
}
