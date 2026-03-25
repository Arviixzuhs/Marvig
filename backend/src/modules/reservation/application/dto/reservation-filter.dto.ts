import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'
import { InputType, Field, Int } from '@nestjs/graphql'
import { ReservationStatus, RentalType } from 'generated/prisma/client'
import { IsOptional, IsString, IsInt, IsEnum, IsNumber } from 'class-validator'

@InputType()
export class ReservationFilterDto extends PaginationFilterDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  userId?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  apartamentId?: number

  @Field(() => ReservationStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus

  @Field(() => RentalType, { nullable: true })
  @IsOptional()
  @IsEnum(RentalType)
  type?: RentalType

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  startDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  endDate?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  minPrice?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxPrice?: number
}
