import { ExpenseFilterDto } from '@/modules/expense/application/dto/expense-filter.dto'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { IsOptional, IsString, IsInt, IsEnum, IsNumber, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'

export class ExpenseReportQueryDto extends ExpenseFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  override page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  override pageSize?: number

  @IsOptional()
  @IsDateString({}, { message: 'Debe ser una fecha válida en formato ISO (YYYY-MM-DD)' })
  override fromDate?: string

  @IsOptional()
  @IsDateString({}, { message: 'Debe ser una fecha válida en formato ISO (YYYY-MM-DD)' })
  override toDate?: string

  @IsOptional()
  @IsEnum(ExpenseCategory)
  override category?: ExpenseCategory

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  override apartmentId?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  override employeeId?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  override minAmount?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  override maxAmount?: number

  @IsOptional()
  @IsString()
  override search?: string
}
