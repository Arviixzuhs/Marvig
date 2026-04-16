import { Type } from 'class-transformer'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { InputType, Field, Int, Float } from '@nestjs/graphql'
import {
  Min,
  IsInt,
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator'

@InputType()
export class ExpenseDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'La descripción no puede exceder los 200 caracteres' })
  description?: string

  @Field(() => Float)
  @Type(() => Number)
  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  amount: number

  @Field(() => String)
  @IsEnum(ExpenseCategory, {
    message: 'La categoría seleccionada no es válida',
  })
  category: ExpenseCategory

  @Field(() => Int, { nullable: true })
  @Type(() => Number)
  @IsInt({ message: 'El ID del apartamento debe ser un número entero' })
  @IsOptional()
  apartmentId?: number

  @Field(() => Int, { nullable: true })
  @Type(() => Number)
  @IsInt({ message: 'El ID del empleado debe ser un número entero' })
  @IsOptional()
  employeeId?: number

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
  @IsDate({ message: 'La fecha proporcionada no es válida' })
  @IsOptional()
  date?: Date

  @Field(() => String, { nullable: true })
  @IsEnum(PaymentMethod, {
    message: 'El método de pago seleccionado no es válido',
  })
  @IsOptional()
  paymentMethod?: PaymentMethod
}
