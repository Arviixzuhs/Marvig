import { PaymentPage } from '@/modules/payment/application/dto/payment-page.dto'
import { PaymentType } from '@/modules/payment/infrastructure/graphql/types/payment.type'
import { CreatePaymentDto } from '@/modules/payment/application/dto/create-payment.dto'
import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { FindPaymentUseCase } from '@/modules/payment/application/usecases/find-payments.usecase'
import { FindPaymentsUseCase } from '@/modules/payment/application/usecases/find-payment.usecase'
import { CreatePaymentUseCase } from '@/modules/payment/application/usecases/create-payment.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => PaymentType)
export class PaymentResolver {
  constructor(
    private readonly findPaymentUseCase: FindPaymentUseCase,
    private readonly findPaymentsUseCase: FindPaymentsUseCase,
    private readonly createPaymentUseCase: CreatePaymentUseCase,
  ) {}

  @Mutation(() => PaymentType)
  createPayment(@Args('data') data: CreatePaymentDto): Promise<PaymentType> {
    return this.createPaymentUseCase.execute(data)
  }

  @Query(() => PaymentPage)
  findPayments(@Args('filters') filters: PaymentFilterDto): Promise<PaymentPage> {
    return this.findPaymentsUseCase.execute(filters)
  }

  @Query(() => PaymentType)
  findPaymentById(@Args('id', { type: () => Int }) id: number): Promise<PaymentType> {
    return this.findPaymentUseCase.execute(id)
  }
}
