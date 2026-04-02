import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger' // Importación de Swagger
import { IsInt, IsOptional } from 'class-validator'
import { RentalType, ReservationStatus } from 'generated/prisma/enums'
import { CreateReservationDto } from './create-reservation.dto'

registerEnumType(ReservationStatus, {
  name: 'ReservationStatus',
})

registerEnumType(RentalType, {
  name: 'RentalType',
})

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
