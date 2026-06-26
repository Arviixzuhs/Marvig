import { Transform } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator'

export class OccupancyReportQueryDto {
  @IsNotEmpty()
  @IsDateString({}, { message: 'Debe ser una fecha válida en formato ISO (YYYY-MM-DD)' })
  fromDate: string

  @IsNotEmpty()
  @IsDateString({}, { message: 'Debe ser una fecha válida en formato ISO (YYYY-MM-DD)' })
  toDate: string

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined
    if (Array.isArray(value)) return value.map(Number)
    return [Number(value)]
  })
  apartmentIds?: number[]
}
