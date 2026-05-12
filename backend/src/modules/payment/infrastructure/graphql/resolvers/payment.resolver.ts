import { UserRole } from '@/common/enums/user-role.enum'
import { PaymentType } from '@/modules/payment/infrastructure/graphql/types/payment.type'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { PaymentPageType } from '@/modules/payment/infrastructure/graphql/types/payment-page.type'
import { CreatePaymentDto } from '@/modules/payment/application/dto/create-payment.dto'
import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { FindPaymentUseCase } from '@/modules/payment/application/usecases/find-payment.usecase'
import { FindPaymentsUseCase } from '@/modules/payment/application/usecases/find-payments.usecase'
import { CreatePaymentUseCase } from '@/modules/payment/application/usecases/create-payment.usecase'
import { PaymentPerformanceType } from '@/modules/payment/infrastructure/graphql/types/payment-performance.type'
import { GetPaymentsPerformanceUseCase } from '@/modules/payment/application/usecases/get-payments-performance.usercase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => PaymentType)
export class PaymentResolver {
  constructor(
    private readonly findPaymentUseCase: FindPaymentUseCase,
    private readonly findPaymentsUseCase: FindPaymentsUseCase,
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly getPaymentsPerformanceUseCase: GetPaymentsPerformanceUseCase,
  ) {}

  @Mutation(() => PaymentType)
  @RequiredRole(UserRole.ADMIN)
  createPayment(@Args('data') data: CreatePaymentDto): Promise<PaymentType> {
    return this.createPaymentUseCase.execute(data)
  }

  @Query(() => PaymentPageType)
  @RequiredRole(UserRole.ADMIN)
  findPayments(@Args('filters') filters: PaymentFilterDto): Promise<PaymentPageType> {
    return this.findPaymentsUseCase.execute(filters)
  }

  @Query(() => PaymentType)
  @RequiredRole(UserRole.ADMIN)
  findPaymentById(@Args('id', { type: () => Int }) id: number): Promise<PaymentType> {
    return this.findPaymentUseCase.execute(id)
  }

  @Query(() => PaymentPerformanceType)
  @RequiredRole(UserRole.ADMIN)
  getPaymentsPerformance(
    @Args('filters') filters: PaymentFilterDto,
  ): Promise<PaymentPerformanceType> {
    return this.getPaymentsPerformanceUseCase.execute(filters)
  }
}
