import { DateFilterInput } from '@/common/graphql/inputs/date-filter.input'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { IsOptional, IsString, IsEmail } from 'class-validator'
import { InputType, Field, IntersectionType } from '@nestjs/graphql'

@InputType()
export class UserFilterInput extends IntersectionType(PaginationFilterInput, DateFilterInput) {
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
}
