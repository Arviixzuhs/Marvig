import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { Field, InputType, Int, Float } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt, IsEnum, IsNumber, IsDateString } from 'class-validator'

@InputType()
export class ExpenseFilterInput extends PaginationFilterInput {
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
