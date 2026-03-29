import { Decimal } from '@prisma/client/runtime/client'
import { EmployeeType } from '@/modules/employee/infrastructure/graphql/types/employee.type'
import { ApartmentType } from '@/modules/apartment/infrastructure/graphql/types/apartment.type'
import { ExpenseCategory } from 'generated/prisma/enums'
import { ObjectType, Field, Int, Float, registerEnumType } from '@nestjs/graphql'

registerEnumType(ExpenseCategory, {
  name: 'ExpenseCategory',
  description: 'Categorías permitidas para la clasificación de gastos',
})

@ObjectType()
export class ExpenseType {
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

  @Field(() => ApartmentType, { nullable: true })
  apartment?: ApartmentType

  @Field(() => EmployeeType, { nullable: true })
  employee?: EmployeeType | null
}
