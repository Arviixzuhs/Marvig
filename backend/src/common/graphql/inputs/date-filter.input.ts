import { Transform } from 'class-transformer'
import { IsDateString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType({ isAbstract: true })
export class DateFilterInput {
  @Field({ nullable: true })
  @Transform(({ value }) => {
    if (!value || String(value).trim() === '') return undefined
    return new Date(value).toISOString()
  })
  @IsDateString({}, { message: 'La fecha de entrada debe tener un formato ISO válido' })
  fromDate: string

  @Field({ nullable: true })
  @Transform(({ value }) => {
    if (!value || String(value).trim() === '') return undefined
    return new Date(value).toISOString()
  })
  @IsDateString({}, { message: 'La fecha de salida debe tener un formato ISO válido' })
  toDate: string
}
