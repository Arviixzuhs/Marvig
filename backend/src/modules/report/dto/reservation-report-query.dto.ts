import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { Transform, Type } from 'class-transformer'
import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator'

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
  @Transform(({ value }) => (Array.isArray(value) ? value : value ? [value] : []))
  @IsEnum(ReservationStatus, { each: true, message: 'Cada estado debe ser un valor válido' })
  override status?: ReservationStatus[]

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
