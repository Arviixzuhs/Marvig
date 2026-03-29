import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { ReservationType } from '@/modules/reservation/infrastructure/graphql/types/reservation.type'

@ObjectType()
export class ReservationPage extends PageType(ReservationType) {}
