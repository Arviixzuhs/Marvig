import { Module } from '@nestjs/common'
import { ExpenseDomainModule } from './domain/expense.domain.module'
import { ExpenseApplicationModule } from './application/expense.application.module'
import { ExpenseInfrastructureModule } from './infrastructure/expense.infrastructure.module'

@Module({
  imports: [ExpenseDomainModule, ExpenseApplicationModule, ExpenseInfrastructureModule],
  controllers: [],
  providers: [],
})
export class ExpenseModule {}
