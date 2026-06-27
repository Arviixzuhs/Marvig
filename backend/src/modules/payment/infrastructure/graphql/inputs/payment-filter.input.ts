import { Type } from 'class-transformer'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { DateFilterInput } from '@/common/graphql/inputs/date-filter.input'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { InputType, Field, Int, IntersectionType } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt, IsEnum, IsArray } from 'class-validator'

@InputType()
export class PaymentFilterInput extends IntersectionType(PaginationFilterInput, DateFilterInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El ID de la reserva debe ser un número entero' })
  reservationId?: number

  @Field(() => [PaymentStatus], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'El estado debe ser un arreglo de estados' })
  @IsEnum(PaymentStatus, { each: true, message: 'Cada estado debe ser un valor válido' })
  status?: PaymentStatus[]

  @Field(() => [PaymentMethod], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'El método debe ser un arreglo de métodos' })
  @IsEnum(PaymentMethod, { each: true, message: 'Cada estado debe ser un valor válido' })
  method?: PaymentMethod[]
}
