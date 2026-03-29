import { Decimal } from '@prisma/client/runtime/index-browser'
import { RentalType, ReservationStatus } from 'generated/prisma/enums'
import { Field, Float, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(ReservationStatus, { name: 'ReservationStatus' })
registerEnumType(RentalType, { name: 'RentalType' })

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
  totalPrice: Decimal

  @Field(() => Int)
  userId: number

  @Field({ nullable: true })
  createdAt?: Date

  @Field({ nullable: true })
  updatedAt?: Date
}
