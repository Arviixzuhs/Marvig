import { Type } from '@nestjs/common'
import { Field, Int, ObjectType } from '@nestjs/graphql'

export function PageType<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PageClass {
    @Field(() => [classRef])
    content: T[]

    @Field(() => Int)
    totalItems: number

    @Field(() => Int)
    totalPages: number

    @Field(() => Int)
    currentPage: number

    @Field(() => Int)
    rowsPerPage: number
  }

  return PageClass
}
