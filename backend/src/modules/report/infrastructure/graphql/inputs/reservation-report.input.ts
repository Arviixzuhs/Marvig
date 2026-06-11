import { InputType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt, IsEnum, IsDateString } from 'class-validator'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'

@InputType()
export class ReservationReportInput extends PaginationFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string

  @Field(() => ReservationStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  apartmentId?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  userId?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string
}
