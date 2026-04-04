import { Type } from 'class-transformer'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { InputType, Field, Int, Float } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  Min,
  IsInt,
  IsDate,
  IsEnum,
} from 'class-validator'

@InputType()
export class CreatePaymentDto {
  @Field(() => Date)
  @Type(() => Date)
  @IsDate({ message: 'La fecha debe ser válida' })
  @IsNotEmpty({ message: 'La fecha del pago es obligatoria' })
  date: Date

  @Field(() => Float)
  @Type(() => Number)
  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  amount: number

  @Field(() => PaymentMethod)
  @IsEnum(PaymentMethod, { message: 'Método de pago no válido' })
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  method: PaymentMethod

  @Field(() => PaymentStatus, { defaultValue: PaymentStatus.PENDING })
  @IsEnum(PaymentStatus, { message: 'Estado de pago no válido' })
  @IsOptional()
  status?: PaymentStatus

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'La referencia es obligatoria' })
  @MaxLength(200, { message: 'La referencia no puede exceder los 200 caracteres' })
  reference: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'La descripción no puede exceder los 200 caracteres' })
  description?: string

  @Field(() => Int)
  @Type(() => Number)
  @IsInt({ message: 'El ID de la reserva debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la reserva es obligatorio' })
  reservationId: number
}
