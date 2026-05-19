import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { InputType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt, IsEnum, IsNumber } from 'class-validator'

@InputType()
export class ReservationFilterInput extends PaginationFilterInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  userId?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  apartmentId?: number

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
