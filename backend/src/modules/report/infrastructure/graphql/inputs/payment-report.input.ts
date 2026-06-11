import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'

@InputType()
export class PaymentReportInput extends PaginationFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fromDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  toDate?: string

  @Field(() => PaymentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string
}
