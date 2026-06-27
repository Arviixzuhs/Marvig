import { Type } from 'class-transformer'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'
import { IsOptional, IsString, IsInt, IsEnum, IsDateString, IsArray } from 'class-validator'

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
  @IsArray({ message: 'El estado debe ser un arreglo de estados' })
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
