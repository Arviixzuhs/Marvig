import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { Field, Float, InputType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator'

@InputType()
export class UpdateReservationInput {
  @Field(() => ReservationStatus, { nullable: true })
  @IsOptional()
  status?: ReservationStatus

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  persons?: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un valor numérico' })
  @Min(0, { message: 'El precio total no puede ser negativo' })
  totalPrice?: number

  @Field({ nullable: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value || String(value).trim() === '') return undefined
    return new Date(value).toISOString()
  })
  @IsDateString({}, { message: 'La fecha de entrada debe tener un formato ISO válido' })
  startDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value || String(value).trim() === '') return undefined
    return new Date(value).toISOString()
  })
  @IsDateString({}, { message: 'La fecha de salida debe tener un formato ISO válido' })
  endDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  clientName?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  clientEmail?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  clientPhone?: string
}
