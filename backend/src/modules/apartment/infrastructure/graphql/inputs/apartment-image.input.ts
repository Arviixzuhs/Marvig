import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class ApartmentImageInput {
  @Field(() => Int)
  id: number

  @Field(() => [String])
  imageUrls: string[]
}
