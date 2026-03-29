import { ExpenseCategory } from 'generated/prisma/enums'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'
import { Field, InputType, Int, Float } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt, IsEnum, IsNumber, IsDateString } from 'class-validator'

@InputType()
export class ExpenseFilterDto extends PaginationFilterDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  apartmentId?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  employeeId?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  minAmount?: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxAmount?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fromDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  toDate?: string
}
