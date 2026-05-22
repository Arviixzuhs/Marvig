import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { InputType, Field, Int, Float } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt, Min, IsEnum, IsNumber } from 'class-validator'

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
}
