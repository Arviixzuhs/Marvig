import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { ReservationType } from './reservation.type'

@ObjectType()
export class ReservationPageType extends PageType(ReservationType) {}
