import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ApartmentImageType {
  @Field(() => Int)
  id: number

  @Field()
  url: string

  @Field({ defaultValue: false })
  isPrimary: boolean

  @Field(() => Int)
  apartmentId: number
}
