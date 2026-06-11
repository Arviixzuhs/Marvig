import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { RentalType } from '@/modules/reservation/domain/enums/rental-type.enum'

@ObjectType()
export class ReservationReportApartmentType {
  @Field(() => Int)
  id: number

  @Field()
  number: string

  @Field(() => Int)
  floor: number
}

@ObjectType()
export class ReservationReportPaymentType {
  @Field(() => Int)
  id: number

  @Field(() => Float)
  amount: number

  @Field(() => PaymentStatus)
  status: PaymentStatus

  @Field(() => PaymentMethod)
  method: PaymentMethod

  @Field(() => Date)
  date: Date
}

@ObjectType()
export class ReservationReportItemType {
  @Field(() => Int)
  id: number

  @Field(() => Date)
  startDate: Date

  @Field(() => Date)
  endDate: Date

  @Field(() => ReservationStatus)
  status: ReservationStatus

  @Field(() => RentalType)
  type: RentalType

  @Field(() => Float)
  totalPrice: number

  @Field(() => Float)
  totalPaid: number

  @Field(() => Float)
  pendingAmount: number

  @Field({ nullable: true })
  clientName?: string | null

  @Field({ nullable: true })
  clientEmail?: string | null

  @Field({ nullable: true })
  clientPhone?: string | null

  @Field(() => Int, { nullable: true })
  userId?: number | null

  @Field(() => [ReservationReportApartmentType])
  apartments: ReservationReportApartmentType[]

  @Field(() => [ReservationReportPaymentType])
  payments: ReservationReportPaymentType[]
}

@ObjectType()
export class ReservationReportPageType {
  @Field(() => [ReservationReportItemType])
  content: ReservationReportItemType[]

  @Field(() => Int)
  totalItems: number

  @Field(() => Int)
  totalPages: number

  @Field(() => Int, { nullable: true })
  currentPage?: number

  @Field(() => Int, { nullable: true })
  rowsPerPage?: number
}
