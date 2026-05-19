import { IsInt, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { CreateReservationInput } from '../inputs/create-reservation.input'
import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class ReservationInput extends CreateReservationInput {
  @ApiPropertyOptional({
    description: 'ID único de la reserva (solo para actualizaciones)',
    example: 1,
  })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  id?: number
}
