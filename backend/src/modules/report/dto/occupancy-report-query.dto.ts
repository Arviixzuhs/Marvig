import { IsNotEmpty, IsString, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class OccupancyReportQueryDto {
  @IsNotEmpty()
  @IsString()
  fromDate: string

  @IsNotEmpty()
  @IsString()
  toDate: string

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined
    if (Array.isArray(value)) return value.map(Number)
    return [Number(value)]
  })
  apartmentIds?: number[]
}
