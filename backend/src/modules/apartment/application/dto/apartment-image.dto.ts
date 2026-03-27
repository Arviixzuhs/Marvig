import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class ApartmentImageDto {
  @Field(() => Int)
  id: number

  @Field(() => [String])
  imageUrls: string[]
}
