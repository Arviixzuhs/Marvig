import { ExpenseCategory } from 'generated/prisma/enums'
import { InputType, Field, Int, Float } from '@nestjs/graphql'
import { Min, IsInt, IsEnum, IsNumber, IsString, MaxLength, IsOptional } from 'class-validator'

@InputType()
export class ExpenseDto {
  @Field()
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'La descripción no puede exceder los 200 caracteres' })
  description?: string

  @Field(() => Float)
  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  amount: number

  @Field(() => String)
  @IsEnum(ExpenseCategory, {
    message: 'La categoría seleccionada no es válida',
  })
  category: ExpenseCategory

  @Field(() => Int)
  @IsInt({ message: 'El ID del apartamento debe ser un número entero' })
  @IsOptional()
  apartmentId?: number

  @Field(() => Int, { nullable: true })
  @IsInt({ message: 'El ID del empleado debe ser un número entero' })
  @IsOptional()
  employeeId?: number

  @Field({ nullable: true })
  @IsOptional()
  date?: Date
}
