import { Type } from 'class-transformer'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'
import { InputType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt } from 'class-validator'

@InputType()
export class PaymentFilterDto extends PaginationFilterDto {
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
