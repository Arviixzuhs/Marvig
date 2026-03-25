import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'

@ObjectType()
export class ApartamentPage extends PageType(ApartamentModel) {}
