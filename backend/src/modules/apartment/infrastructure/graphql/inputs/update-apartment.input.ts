import { ApartmentInput } from './apartment.input'
import { InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateApartmentInput extends PartialType(ApartmentInput) {}
