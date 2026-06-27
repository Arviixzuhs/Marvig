import { DateFilterInput } from '@/common/graphql/inputs/date-filter.input'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { Field, Float, InputType, Int, IntersectionType } from '@nestjs/graphql'
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'

@InputType()
export class ApartmentFilterInput extends IntersectionType(PaginationFilterInput, DateFilterInput) {
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

  @Field(() => [ApartmentStatusEnum], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'El estado debe ser un arreglo de métodos' })
  @IsEnum(ApartmentStatusEnum, { each: true, message: 'Cada estado debe ser un valor válido' })
  status?: ApartmentStatusEnum[]

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
}
