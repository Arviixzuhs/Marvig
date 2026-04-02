import { IsInt, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { CreateReservationDto } from './create-reservation.dto'
import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class ReservationDto extends CreateReservationDto {
  @ApiPropertyOptional({
    description: 'ID único de la reserva (solo para actualizaciones)',
    example: 1,
  })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  id?: number
}
