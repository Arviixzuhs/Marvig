import { ObjectType, Field, Int, Float, registerEnumType } from '@nestjs/graphql'
import { ApartmentImageModel } from './apartment-image.model'
import { ApartmentStatus } from 'generated/prisma/enums'

registerEnumType(ApartmentStatus, {
  name: 'ApartmentStatus',
  description: 'Los estados posibles de un apartmento en la posada',
})

@ObjectType()
export class ApartmentModel {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  floor: number

  @Field()
  number: string

  @Field(() => ApartmentStatus)
  status: ApartmentStatus

  @Field(() => Int)
  bedrooms: number

  @Field(() => Int)
  bathrooms: number

  @Field(() => Float, { nullable: true })
  squareMeters?: number | null

  @Field(() => [ApartmentImageModel], { nullable: 'itemsAndList' })
  images?: ApartmentImageModel[] | null

  @Field({ nullable: true })
  createdAt?: Date | null

  @Field({ nullable: true })
  updatedAt?: Date | null
}
