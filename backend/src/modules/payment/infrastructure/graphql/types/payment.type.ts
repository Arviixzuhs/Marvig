import { ReservationType } from '@/modules/reservation/infrastructure/graphql/types/reservation.type'
import { ObjectType, Field, Int, Float } from '@nestjs/graphql'

@ObjectType()
export class PaymentType {
  @Field(() => Int)
  id: number

  @Field(() => Float)
  amount: number

  @Field({ nullable: true })
  description?: string | null

  @Field(() => Int)
  reservationId: number

  @Field({ nullable: true })
  createdAt?: Date | null

  @Field(() => ReservationType, { nullable: true })
  reservation?: ReservationType
}
