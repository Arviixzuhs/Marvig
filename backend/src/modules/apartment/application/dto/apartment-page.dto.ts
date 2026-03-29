import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { ApartmentType } from '@/modules/apartment/infrastructure/graphql/types/apartment.type'

@ObjectType()
export class ApartmentPage extends PageType(ApartmentType) {}
