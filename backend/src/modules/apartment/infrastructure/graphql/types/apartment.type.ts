import { Decimal } from '@prisma/client/runtime/client'
import { PromotionType } from '@/modules/promotion/infrastructure/graphql/types/promotion.type'
import { ApartmentStatus } from 'generated/prisma/enums'
import { ApartmentImageType } from './apartment-image.type'
import { ObjectType, Field, Int, Float, registerEnumType } from '@nestjs/graphql'

registerEnumType(ApartmentStatus, {
  name: 'ApartmentStatus',
  description: 'Los estados posibles de un apartamento en la posada',
})

@ObjectType()
export class ApartmentType {
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

  @Field(() => Float)
  pricePerDay: Decimal

  @Field(() => Float, { nullable: true })
  squareMeters?: number | null

  @Field(() => [ApartmentImageType], { nullable: 'itemsAndList' })
  images?: ApartmentImageType[] | null

  @Field(() => PromotionType, { nullable: true })
  promotion?: PromotionType | null

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
