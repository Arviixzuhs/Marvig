import { InputType, Field } from '@nestjs/graphql'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { IsOptional, IsString, IsEmail } from 'class-validator'

@InputType()
export class UserFilterInput extends PaginationFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fromDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  toDate?: string
}
