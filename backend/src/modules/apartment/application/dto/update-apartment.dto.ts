import { ApartmentDto } from './apartment.dto'
import { InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateApartmentDto extends PartialType(ApartmentDto) {}
