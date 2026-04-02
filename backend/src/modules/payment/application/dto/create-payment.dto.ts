import { InputType, Field, Int, Float } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString, MaxLength, IsNumber, Min, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

@InputType()
export class CreatePaymentDto {
  @Field(() => Float)
  @Type(() => Number)
  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  amount: number

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
