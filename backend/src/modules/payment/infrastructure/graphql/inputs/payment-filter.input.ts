import { Type } from 'class-transformer'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { InputType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt } from 'class-validator'

@InputType()
export class PaymentFilterInput extends PaginationFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El ID de la reserva debe ser un número entero' })
  reservationId?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fromDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  toDate?: string
}
