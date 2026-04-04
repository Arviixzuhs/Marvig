import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { ReservationType } from '@/modules/reservation/infrastructure/graphql/types/reservation.type'
import { ObjectType, Field, Int, Float } from '@nestjs/graphql'

@ObjectType()
export class PaymentType {
  @Field(() => Int)
  id: number

  @Field(() => Date)
  date: Date

  @Field(() => Float)
  amount: number

  @Field(() => PaymentMethod)
  method: PaymentMethod

  @Field(() => PaymentStatus)
  status: PaymentStatus

  @Field()
  reference: string

  @Field({ nullable: true })
  description?: string | null

  @Field(() => Int)
  reservationId: number

  @Field({ nullable: true })
  createdAt?: Date | null

  @Field(() => ReservationType, { nullable: true })
  reservation?: ReservationType
}
