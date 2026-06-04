import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { ReservationPaymentDto } from './reservation-payment.input'
import { Field, Float, InputType, Int } from '@nestjs/graphql'
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'
import { Transform } from 'class-transformer'

@InputType()
export class CreateReservationInput {
  @Field({ nullable: false })
  @IsNotEmpty({ message: 'La fecha de entrada es obligatoria' })
  @Transform(({ value }) => {
    if (!value || String(value).trim() === '') return undefined;
    return new Date(value).toISOString();
  })
  @IsDateString({}, { message: 'La fecha de entrada debe tener un formato ISO válido' })
  startDate: string

  @Field({ nullable: false })
  @IsNotEmpty({ message: 'La fecha de salida es obligatoria' })
  @Transform(({ value }) => {
    if (!value || String(value).trim() === '') return undefined;
    return new Date(value).toISOString();
  })
  @IsDateString({}, { message: 'La fecha de salida debe tener un formato ISO válido' })
  endDate: string

  @Field(() => [Int], { nullable: false })
  @IsNotEmpty({ message: 'Los apartamentos son obligatorios' })
  @IsArray({ message: 'Debe ser un arreglo de IDs' })
  @ArrayMinSize(1, { message: 'Debe agregar mínimo 1 apartamento' })
  @IsInt({ each: true, message: 'Cada ID debe ser un número entero' })
  apartmentIds: number[]

  @Field(() => Float, { nullable: false })
  @IsNotEmpty({ message: 'El precio total es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un valor numérico' })
  @Min(0, { message: 'El precio total no puede ser negativo' })
  totalPrice: number

  @Field(() => RentalType, { nullable: true })
  @IsEnum(RentalType, { message: 'Tipo de alquiler no válido' })
  type?: RentalType

  @Field(() => ReservationStatus, { nullable: true })
  @IsEnum(ReservationStatus, { message: 'Estado de reserva no válido' })
  status?: ReservationStatus

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

  @Field()
  payment: ReservationPaymentDto

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'El número de personas debe ser un número entero' })
  @Min(1, { message: 'El número de personas debe ser mayor a 0' })
  persons?: number
}
