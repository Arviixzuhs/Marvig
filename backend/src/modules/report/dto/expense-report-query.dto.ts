import { ExpenseFilterDto } from '@/modules/expense/application/dto/expense-filter.dto'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { IsOptional, IsString, IsInt, IsEnum, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * Extiende ExpenseFilterDto agregando validaciones de class-validator.
 * No redefine lógica de filtrado; reutiliza los campos del dominio.
 */
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
  @IsString()
  override fromDate?: string

  @IsOptional()
  @IsString()
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
