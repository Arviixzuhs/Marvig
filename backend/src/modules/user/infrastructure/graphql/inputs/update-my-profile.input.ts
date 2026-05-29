import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateMyProfileInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phone?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string
}
