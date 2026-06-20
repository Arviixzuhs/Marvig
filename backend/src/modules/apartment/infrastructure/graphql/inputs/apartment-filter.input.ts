import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'

@InputType()
export class ApartmentFilterInput extends PaginationFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsInt({ each: true })
  ids?: number[]

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  number?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  floor?: number

  @Field(() => ApartmentStatusEnum, { nullable: true })
  @IsOptional()
  @IsEnum(ApartmentStatusEnum)
  status?: ApartmentStatusEnum

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  bedrooms?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  bathrooms?: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  minSquareMeters?: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxSquareMeters?: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  minPrice?: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxPrice?: number

  @Field({ nullable: true })
  @Transform(({ value }) => {
    if (!value || String(value).trim() === '') return undefined
    return new Date(value).toISOString()
  })
  @IsDateString({}, { message: 'La fecha de entrada debe tener un formato ISO válido' })
  fromDate: string

  @Field({ nullable: true })
  @Transform(({ value }) => {
    if (!value || String(value).trim() === '') return undefined
    return new Date(value).toISOString()
  })
  @IsDateString({}, { message: 'La fecha de salida debe tener un formato ISO válido' })
  toDate: string
}
