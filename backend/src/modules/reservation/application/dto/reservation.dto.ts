import { RentalType, ReservationStatus } from 'generated/prisma/enums'
import { Field, Float, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { Min, IsInt, IsEnum, IsNumber, IsNotEmpty, IsOptional, IsDateString } from 'class-validator'

registerEnumType(ReservationStatus, {
  name: 'ReservationStatus',
})

registerEnumType(RentalType, {
  name: 'RentalType',
})

@InputType()
export class ReservationDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  id?: number

  @Field({ nullable: false })
  @IsNotEmpty({ message: 'La fecha de salida es obligatoria' })
  @IsDateString({}, { message: 'La fecha de salida debe tener un formato ISO válido' })
  endDate: string

  @Field({ nullable: false })
  @IsNotEmpty({ message: 'La fecha de entrada es obligatoria' })
  @IsDateString({}, { message: 'La fecha de entrada debe tener un formato ISO válido' })
  startDate: string

  @Field(() => Int, { nullable: false })
  @IsNotEmpty({ message: 'El ID del apartamento es obligatorio' })
  @IsInt({ message: 'El ID del apartamento debe ser un número entero' })
  apartamentId: number

  @Field(() => Float, { nullable: false })
  @IsNotEmpty({ message: 'El precio total es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un valor numérico' })
  @Min(0, { message: 'El precio total no puede ser negativo' })
  totalPrice: number

  @Field(() => RentalType)
  @IsNotEmpty({ message: 'El tipo de alquiler es obligatorio' })
  @IsEnum(RentalType, { message: 'Tipo de alquiler no válido' })
  type: RentalType

  @Field(() => ReservationStatus)
  @IsNotEmpty({ message: 'El estado de la reserva es obligatorio' })
  @IsEnum(ReservationStatus, { message: 'Estado de reserva no válido' })
  status: ReservationStatus
}
