import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ApartmentImageModel {
  @Field(() => Int)
  id: number

  @Field()
  url: string

  @Field({ defaultValue: false })
  isPrimary: boolean

  @Field(() => Int)
  apartmentId: number
}
