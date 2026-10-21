import { Field, InputType, Int } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { ArrayNotEmpty, IsArray, IsDateString, IsInt } from 'class-validator'

@InputType()
export class CalculateReservationTotalInput {
  @Field(() => [Int])
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  apartmentIds: number[]

  @Field({ nullable: true })
  @Transform(({ value }) => {
    if (!value || String(value).trim() === '') return undefined
    return new Date(value).toISOString()
  })
  @IsDateString({}, { message: 'La fecha de entrada debe tener un formato ISO válido' })
  startDate: string

  @Field({ nullable: true })
  @Transform(({ value }) => {
    if (!value || String(value).trim() === '') return undefined
    return new Date(value).toISOString()
  })
  @IsDateString({}, { message: 'La fecha de salida debe tener un formato ISO válido' })
  endDate: string
}
