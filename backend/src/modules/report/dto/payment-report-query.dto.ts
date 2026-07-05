import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { Transform, Type } from 'class-transformer'
import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator'

export class PaymentReportQueryDto extends PaymentFilterDto {
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
  @IsEnum(PaymentStatus, { each: true, message: 'Cada estado debe ser un valor válido' })
  override status?: PaymentStatus[]

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : []))
  @IsEnum(PaymentMethod, { each: true, message: 'Cada estado debe ser un valor válido' })
  override method?: PaymentMethod[]

  @IsOptional()
  @IsString()
  override search?: string
}
