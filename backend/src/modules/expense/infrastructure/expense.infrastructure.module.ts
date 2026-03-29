import { Module } from '@nestjs/common'
import { ExpenseResolver } from '@/modules/expense/infrastructure/resolvers/expense.resolver'
import { ExpenseApplicationModule } from '@/modules/expense/application/expense.application.module'

@Module({
  imports: [ExpenseApplicationModule],
  controllers: [],
  providers: [ExpenseResolver],
  exports: [],
})
export class ExpenseInfrastructureModule {}
