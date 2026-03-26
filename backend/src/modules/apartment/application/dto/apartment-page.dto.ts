import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'

@ObjectType()
export class ApartmentPage extends PageType(ApartmentModel) {}
