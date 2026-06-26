import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { IsOptional, IsString, IsInt, IsEnum, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'

/**
 * Extiende ReservationFilterDto agregando validaciones de class-validator.
 * No redefine lógica de filtrado; reutiliza los campos del dominio.
 */
export class ReservationReportQueryDto extends ReservationFilterDto {
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
  override startDate?: string

  @IsOptional()
  @IsDateString({}, { message: 'Debe ser una fecha válida en formato ISO (YYYY-MM-DD)' })
  override endDate?: string

  @IsOptional()
  @IsEnum(ReservationStatus)
  override status?: ReservationStatus

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  override apartmentId?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  override userId?: number

  @IsOptional()
  @IsString()
  override search?: string
}
