import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'

@ObjectType()
export class ExpenseReportApartmentType {
  @Field(() => Int)
  id: number

  @Field()
  number: string

  @Field(() => Int)
  floor: number
}

@ObjectType()
export class ExpenseReportItemType {
  @Field(() => Int)
  id: number

  @Field(() => Float)
  amount: number

  @Field(() => ExpenseCategory)
  category: ExpenseCategory

  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field({ nullable: true })
  description?: string

  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: PaymentMethod

  @Field(() => Int, { nullable: true })
  apartmentId?: number

  @Field(() => Int, { nullable: true })
  employeeId?: number | null

  @Field(() => ExpenseReportApartmentType, { nullable: true })
  apartment?: ExpenseReportApartmentType
}

@ObjectType()
export class ExpenseReportPageType {
  @Field(() => [ExpenseReportItemType])
  content: ExpenseReportItemType[]

  @Field(() => Int)
  totalItems: number

  @Field(() => Int)
  totalPages: number

  @Field(() => Int, { nullable: true })
  currentPage?: number

  @Field(() => Int, { nullable: true })
  rowsPerPage?: number
}
