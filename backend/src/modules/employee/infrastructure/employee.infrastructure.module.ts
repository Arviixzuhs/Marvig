import { Module } from '@nestjs/common'
import { EmployeeResolver } from '@/modules/employee/infrastructure/graphql/resolvers/employee.resolver'
import { EmployeeApplicationModule } from '@/modules/employee/application/employee.application.module'

@Module({
  imports: [EmployeeApplicationModule],
  controllers: [],
  providers: [EmployeeResolver],
  exports: [],
})
export class EmployeeInfrastructureModule {}
