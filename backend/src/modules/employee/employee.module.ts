import { Module } from '@nestjs/common'
import { EmployeeDomainModule } from './domain/employee.domain.module'
import { EmployeeApplicationModule } from './application/employee.application.module'
import { EmployeeInfrastructureModule } from './infrastructure/employee.infrastructure.module'

@Module({
  imports: [EmployeeDomainModule, EmployeeApplicationModule, EmployeeInfrastructureModule],
  controllers: [],
  providers: [],
})
export class EmployeeModule {}
