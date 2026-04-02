import { PromotionType } from '@/modules/promotion/infrastructure/graphql/types/promotion.type'
import { ApartmentImageType } from './apartment-image.type'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { ObjectType, Field, Int, Float } from '@nestjs/graphql'

@ObjectType()
export class ApartmentType {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  floor: number

  @Field()
  number: string

  @Field(() => ApartmentStatusEnum)
  status: ApartmentStatusEnum

  @Field(() => Int)
  bedrooms: number

  @Field(() => Int)
  bathrooms: number

  @Field(() => Float)
  pricePerDay: number

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
