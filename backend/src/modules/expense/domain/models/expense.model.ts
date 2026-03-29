import { EmployeeModel } from '@/modules/employee/domain/models/employee.model'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ExpenseCategory } from 'generated/prisma/enums'
import { ObjectType, Field, Int, Float, registerEnumType } from '@nestjs/graphql'
import { Decimal } from '@prisma/client/runtime/client'

registerEnumType(ExpenseCategory, {
  name: 'ExpenseCategory',
  description: 'Categorías permitidas para la clasificación de gastos',
})

@ObjectType()
export class ExpenseModel {
  @Field(() => Int)
  id: number

  @Field()
  description: string

  @Field(() => Float)
  amount: Decimal

  @Field(() => ExpenseCategory)
  category: ExpenseCategory

  @Field(() => Int)
  apartmentId: number

  @Field(() => Int, { nullable: true })
  employeeId?: number | null

  @Field({ nullable: true })
  createdAt?: Date | null

  @Field({ nullable: true })
  updatedAt?: Date | null

  @Field(() => ApartmentModel, { nullable: true })
  apartment?: ApartmentModel

  @Field(() => EmployeeModel, { nullable: true })
  employee?: EmployeeModel | null
}
