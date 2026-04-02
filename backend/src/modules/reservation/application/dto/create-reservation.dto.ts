import { ApiProperty } from '@nestjs/swagger'
import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator'

@InputType()
export class CreateReservationDto {
  @ApiProperty({
    description: 'Fecha de salida en formato ISO',
    example: '2026-04-10T14:00:00.000Z',
  })
  @Field({ nullable: false })
  @IsNotEmpty({ message: 'La fecha de salida es obligatoria' })
  @IsDateString({}, { message: 'La fecha de salida debe tener un formato ISO válido' })
  endDate: string

  @ApiProperty({
    description: 'Fecha de entrada en formato ISO',
    example: '2026-04-05T12:00:00.000Z',
  })
  @Field({ nullable: false })
  @IsNotEmpty({ message: 'La fecha de entrada es obligatoria' })
  @IsDateString({}, { message: 'La fecha de entrada debe tener un formato ISO válido' })
  startDate: string

  @ApiProperty({
    description: 'Lista de IDs de los apartamentos a reservar',
    type: [Number],
    example: [1, 2],
  })
  @Field(() => [Int], { nullable: false })
  @IsNotEmpty({ message: 'El ID del apartamento es obligatorio' })
  @IsArray({ message: 'Debe ser un arreglo de IDs' })
  @IsInt({ each: true, message: 'Cada ID debe ser un número entero' })
  apartmentIds: number[]

  @ApiProperty({
    description: 'Monto total de la reserva en USD',
    example: 150.5,
  })
  @Field(() => Float, { nullable: false })
  @IsNotEmpty({ message: 'El precio total es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un valor numérico' })
  @Min(0, { message: 'El precio total no puede ser negativo' })
  totalPrice: number

  @ApiProperty({
    enum: RentalType,
    description: 'Tipo de alquiler (Diario, Mensual, etc.)',
    example: RentalType.DAILY,
  })
  @Field(() => RentalType)
  @IsNotEmpty({ message: 'El tipo de alquiler es obligatorio' })
  @IsEnum(RentalType, { message: 'Tipo de alquiler no válido' })
  type: RentalType
}
