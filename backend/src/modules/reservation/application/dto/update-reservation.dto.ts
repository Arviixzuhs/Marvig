import { CreateReservationDto } from './create-reservation.dto'
import { InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
