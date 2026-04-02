import { ApartmentStatus } from 'generated/prisma/client'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'
import { InputType, Field, Int, Float } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt, Min, IsEnum, IsNumber } from 'class-validator'

@InputType()
export class ApartmentFilterDto extends PaginationFilterDto {
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

  @Field(() => ApartmentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ApartmentStatus)
  status?: ApartmentStatus

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
