import { SeasonObjectType } from '@/modules/season/infrastructure/graphql/types/season.type'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('SeasonPage')
export class SeasonPageType {
  @Field(() => [SeasonObjectType])
  content: SeasonObjectType[]

  @Field(() => Int)
  totalPages: number

  @Field(() => Int)
  totalItems: number

  @Field(() => Int)
  currentPage: number

  @Field(() => Int)
  rowsPerPage: number
}
