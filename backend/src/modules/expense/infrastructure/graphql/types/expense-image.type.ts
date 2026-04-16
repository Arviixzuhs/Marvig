import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ExpenseImageType {
  @Field(() => Int)
  id: number

  @Field()
  url: string

  @Field(() => Int)
  expenseId: number
}
