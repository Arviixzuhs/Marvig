import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class InvalidDateType {
  @Field(() => String)
  year: string

  @Field(() => String)
  month: string

  @Field(() => String)
  day: string
}
