import { PageType } from '@/common/dto/page-response.dto'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'

export class ReservationPage extends PageType(ReservationModel) {}
