import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { Field, Float, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ReservationType {
  @Field(() => Int)
  id: number

  @Field()
  startDate: Date

  @Field()
  endDate: Date

  @Field(() => RentalType)
  type: RentalType

  @Field(() => ReservationStatus)
  status: ReservationStatus

  @Field(() => Float)
  totalPrice: number

  @Field(() => Int, { nullable: true })
  userId?: number

  @Field({ nullable: true })
  clientName?: string

  @Field({ nullable: true })
  clientEmail?: string

  @Field({ nullable: true })
  clientPhone?: string

  @Field({ nullable: true })
  createdAt?: Date

  @Field({ nullable: true })
  updatedAt?: Date
}
