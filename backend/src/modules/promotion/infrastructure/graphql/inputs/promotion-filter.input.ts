import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'

@InputType()
export class PromotionFilterInput extends PaginationFilterInput {
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
  @IsString()
  fromDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  toDate?: string
}
