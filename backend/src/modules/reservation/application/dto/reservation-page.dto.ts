import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'

@ObjectType()
export class ReservationPage extends PageType(ReservationModel) {}
