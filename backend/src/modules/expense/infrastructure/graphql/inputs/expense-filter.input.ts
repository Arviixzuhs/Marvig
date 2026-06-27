import { DateFilterInput } from '@/common/graphql/inputs/date-filter.input'
import { ExpenseCategory } from '@/modules/expense/domain/enums/expense-category.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { Field, Float, InputType, Int, IntersectionType } from '@nestjs/graphql'
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'
import { PaymentMethod } from '@/modules/payment/domain/enums/payment-method.enum'

@InputType()
export class ExpenseFilterInput extends IntersectionType(PaginationFilterInput, DateFilterInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  apartmentId?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  employeeId?: number

  @Field(() => [ExpenseCategory], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'El estado debe ser un arreglo de estados' })
  @IsEnum(ExpenseCategory, { each: true, message: 'Cada estado debe ser un valor válido' })
  category?: ExpenseCategory[]

  @Field(() => [PaymentMethod], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'El método debe ser un arreglo de métodos' })
  @IsEnum(PaymentMethod, { each: true, message: 'Cada estado debe ser un valor válido' })
  paymentMethod?: PaymentMethod[]

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  minAmount?: number

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxAmount?: number
}
