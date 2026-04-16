import { EmployeeType } from '@/modules/employee/infrastructure/graphql/types/employee.type'
import { ApartmentType } from '@/modules/apartment/infrastructure/graphql/types/apartment.type'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { ExpenseImageType } from './expense-image.type'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'

@ObjectType()
export class ExpenseType {
  @Field(() => Int)
  id: number

  @Field({ nullable: true })
  description?: string | null

  @Field(() => Float)
  amount: number

  @Field(() => ExpenseCategory)
  category: ExpenseCategory

  @Field({ nullable: true })
  date?: Date | null

  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod: PaymentMethod | null

  @Field(() => [ExpenseImageType], { nullable: 'itemsAndList' })
  images?: ExpenseImageType[] | null

  @Field(() => Int)
  apartmentId: number

  @Field(() => Int, { nullable: true })
  employeeId?: number | null

  @Field({ nullable: true })
  createdAt?: Date | null

  @Field({ nullable: true })
  updatedAt?: Date | null

  @Field(() => ApartmentType, { nullable: true })
  apartment?: ApartmentType

  @Field(() => EmployeeType, { nullable: true })
  employee?: EmployeeType | null
}
