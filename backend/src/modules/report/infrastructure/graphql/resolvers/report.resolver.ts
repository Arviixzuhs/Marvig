import { Resolver, Query, Args } from '@nestjs/graphql'
import { UserRole } from '@/common/enums/user-role.enum'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { PaymentReportUseCase } from '@/modules/report/application/usecases/payment-report.usecase'
import { ExpenseReportUseCase } from '@/modules/report/application/usecases/expense-report.usecase'
import { ReservationReportUseCase } from '@/modules/report/application/usecases/reservation-report.usecase'
import { OccupancyReportUseCase } from '@/modules/report/application/usecases/occupancy-report.usecase'
import { IncomeSummaryUseCase } from '@/modules/report/application/usecases/income-summary.usecase'
import { PaymentReportInput } from '@/modules/report/infrastructure/graphql/inputs/payment-report.input'
import { ExpenseReportInput } from '@/modules/report/infrastructure/graphql/inputs/expense-report.input'
import { ReservationReportInput } from '@/modules/report/infrastructure/graphql/inputs/reservation-report.input'
import { OccupancyReportInput } from '@/modules/report/infrastructure/graphql/inputs/occupancy-report.input'
import { PaymentReportPageType } from '@/modules/report/infrastructure/graphql/types/payment-report.type'
import { ExpenseReportPageType } from '@/modules/report/infrastructure/graphql/types/expense-report.type'
import { ReservationReportPageType } from '@/modules/report/infrastructure/graphql/types/reservation-report.type'
import { OccupancyReportType } from '@/modules/report/infrastructure/graphql/types/occupancy-report.type'
import { IncomeSummaryType } from '@/modules/report/infrastructure/graphql/types/income-summary.type'

@Resolver()
export class ReportResolver {
  constructor(
    private readonly paymentReportUseCase: PaymentReportUseCase,
    private readonly expenseReportUseCase: ExpenseReportUseCase,
    private readonly reservationReportUseCase: ReservationReportUseCase,
    private readonly occupancyReportUseCase: OccupancyReportUseCase,
    private readonly incomeSummaryUseCase: IncomeSummaryUseCase,
  ) {}

  @Query(() => PaymentReportPageType)
  @RequiredRole(UserRole.ADMIN)
  paymentReport(@Args('filters') filters: PaymentReportInput): Promise<PaymentReportPageType> {
    return this.paymentReportUseCase.execute(filters)
  }

  @Query(() => ExpenseReportPageType)
  @RequiredRole(UserRole.ADMIN)
  expenseReport(@Args('filters') filters: ExpenseReportInput): Promise<ExpenseReportPageType> {
    return this.expenseReportUseCase.execute(filters)
  }

  @Query(() => ReservationReportPageType)
  @RequiredRole(UserRole.ADMIN)
  reservationReport(
    @Args('filters') filters: ReservationReportInput,
  ): Promise<ReservationReportPageType> {
    return this.reservationReportUseCase.execute(filters)
  }

  @Query(() => OccupancyReportType)
  @RequiredRole(UserRole.ADMIN)
  occupancyReport(@Args('filters') filters: OccupancyReportInput): Promise<OccupancyReportType> {
    return this.occupancyReportUseCase.execute(filters)
  }

  @Query(() => IncomeSummaryType)
  @RequiredRole(UserRole.ADMIN)
  incomeSummary(@Args('filters') filters: OccupancyReportInput): Promise<IncomeSummaryType> {
    return this.incomeSummaryUseCase.execute(filters)
  }
}
