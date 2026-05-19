import { InputType, Field, Int } from '@nestjs/graphql'
import { IsInt, IsArray, IsString } from 'class-validator'

@InputType()
export class ExpenseImageInput {
  @Field(() => Int)
  @IsInt()
  id: number

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  imageUrls: string[]
}
