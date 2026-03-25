import { Field, InputType } from '@nestjs/graphql'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class EmployeeFilterDto extends PaginationFilterDto {
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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fromDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  toDate?: string
}
