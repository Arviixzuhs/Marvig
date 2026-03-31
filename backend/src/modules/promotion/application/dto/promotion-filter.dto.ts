import { InputType, Field } from '@nestjs/graphql'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class PromotionFilterDto extends PaginationFilterDto {
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
