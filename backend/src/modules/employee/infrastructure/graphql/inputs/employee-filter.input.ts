import { DateFilterInput } from '@/common/graphql/inputs/date-filter.input'
import { IsOptional, IsString } from 'class-validator'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { Field, InputType, IntersectionType } from '@nestjs/graphql'

@InputType()
export class EmployeeFilterInput extends IntersectionType(PaginationFilterInput, DateFilterInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string
}
