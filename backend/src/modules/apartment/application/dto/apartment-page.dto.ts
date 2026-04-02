import { PageType } from '@/common/dto/page-response.dto'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'

export class ApartmentPage extends PageType(ApartmentModel) {}
