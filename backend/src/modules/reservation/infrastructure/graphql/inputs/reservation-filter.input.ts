import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { InputType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt, IsBoolean, IsEnum, IsNumber, IsArray } from 'class-validator'

@InputType()
export class ReservationFilterInput extends PaginationFilterInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  userId?: number

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'El atributo mine debe ser un booleano' })
  mine?: boolean

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  apartmentId?: number

  @Field(() => [ReservationStatus], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'El estado debe ser un arreglo de estados' })
  @IsEnum(ReservationStatus, { each: true, message: 'Cada estado debe ser un valor válido' })
  status?: ReservationStatus[]

  @Field(() => [RentalType], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'El tipo de renta debe ser un arreglo' })
  @IsEnum(RentalType, { each: true, message: 'Cada tipo de renta debe ser un valor válido' })
  type?: RentalType[]

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
