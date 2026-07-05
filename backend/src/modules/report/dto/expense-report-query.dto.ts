import { ExpenseFilterDto } from '@/modules/expense/application/dto/expense-filter.dto'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { Transform, Type } from 'class-transformer'
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

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
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : []))
  @IsEnum(ExpenseCategory, { each: true, message: 'Cada estado debe ser un valor válido' })
  override category?: ExpenseCategory[]

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
