import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { IsOptional, IsString, IsInt, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * Extiende PaymentFilterDto agregando validaciones de class-validator.
 * No redefine lógica de filtrado; reutiliza los campos del dominio.
 */
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
  @IsString()
  override fromDate?: string

  @IsOptional()
  @IsString()
  override toDate?: string

  @IsOptional()
  @IsEnum(PaymentStatus)
  override status?: PaymentStatus

  @IsOptional()
  @IsString()
  override search?: string
}
