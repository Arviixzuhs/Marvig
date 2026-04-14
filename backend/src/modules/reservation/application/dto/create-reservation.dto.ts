import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

@InputType()
export class CreateReservationDto {
  @Field({ nullable: false })
  @IsNotEmpty({ message: 'La fecha de salida es obligatoria' })
  @IsDateString({}, { message: 'La fecha de salida debe tener un formato ISO válido' })
  endDate: string

  @Field({ nullable: false })
  @IsNotEmpty({ message: 'La fecha de entrada es obligatoria' })
  @IsDateString({}, { message: 'La fecha de entrada debe tener un formato ISO válido' })
  startDate: string

  @Field(() => [Int], { nullable: false })
  @IsNotEmpty({ message: 'El ID del apartamento es obligatorio' })
  @IsArray({ message: 'Debe ser un arreglo de IDs' })
  @IsInt({ each: true, message: 'Cada ID debe ser un número entero' })
  apartmentIds: number[]

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

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El nombre del cliente debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre del cliente no puede exceder los 100 caracteres' })
  clientName?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El email del cliente debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El email del cliente no puede exceder los 100 caracteres' })
  clientEmail?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El teléfono del cliente debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El teléfono del cliente no puede exceder los 100 caracteres' })
  clientPhone?: string
}
