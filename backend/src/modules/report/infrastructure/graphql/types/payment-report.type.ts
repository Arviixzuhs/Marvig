import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'

@ObjectType()
export class PaymentReportApartmentType {
  @Field(() => Int)
  id: number

  @Field()
  number: string

  @Field(() => Int)
  floor: number
}

@ObjectType()
export class PaymentReportReservationType {
  @Field(() => Int)
  id: number

  @Field(() => Date)
  startDate: Date

  @Field(() => Date)
  endDate: Date

  @Field({ nullable: true })
  clientName?: string | null

  @Field({ nullable: true })
  clientEmail?: string | null

  @Field({ nullable: true })
  clientPhone?: string | null

  @Field(() => [PaymentReportApartmentType], { nullable: true })
  apartments?: PaymentReportApartmentType[]
}

@ObjectType()
export class PaymentReportItemType {
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

  @Field()
  reference: string

  @Field({ nullable: true })
  description?: string | null

  @Field(() => Int)
  reservationId: number

  @Field(() => PaymentReportReservationType, { nullable: true })
  reservation?: PaymentReportReservationType | null
}

@ObjectType()
export class PaymentReportPageType {
  @Field(() => [PaymentReportItemType])
  content: PaymentReportItemType[]

  @Field(() => Int)
  totalItems: number

  @Field(() => Int)
  totalPages: number

  @Field(() => Int, { nullable: true })
  currentPage?: number

  @Field(() => Int, { nullable: true })
  rowsPerPage?: number
}
