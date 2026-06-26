import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { IsOptional, IsString, IsInt, IsEnum, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'

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
  @IsEnum(PaymentStatus)
  override status?: PaymentStatus

  @IsOptional()
  @IsString()
  override search?: string
}
