import { InputType, Field, Int, Float } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt, IsEnum, IsNumber, IsDateString } from 'class-validator'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'

@InputType()
export class ExpenseReportInput extends PaginationFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fromDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  toDate?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  apartmentId?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  employeeId?: number

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
  @IsString()
  search?: string
}
