import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { Field, InputType } from '@nestjs/graphql'
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

@InputType()
export class ReservationPaymentDto {
  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  date: Date

  @Field(() => PaymentMethod)
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  reference: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string
}
