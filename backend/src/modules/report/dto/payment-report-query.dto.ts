import { Type } from 'class-transformer'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { IsOptional, IsString, IsInt, IsEnum, IsDateString, IsArray } from 'class-validator'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'

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
  @IsArray({ message: 'El estado debe ser un arreglo de estados' })
  @IsEnum(PaymentStatus, { each: true, message: 'Cada estado debe ser un valor válido' })
  override status?: PaymentStatus[]

  @IsOptional()
  @IsArray({ message: 'El método debe ser un arreglo de métodos' })
  @IsEnum(PaymentMethod, { each: true, message: 'Cada estado debe ser un valor válido' })
  override method?: PaymentMethod[]

  @IsOptional()
  @IsString()
  override search?: string
}
