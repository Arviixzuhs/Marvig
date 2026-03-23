import { Module } from '@nestjs/common'
import { EmployeeResolver } from './resolvers/employee.resolver'
import { EmployeeApplicationModule } from '@/modules/employee/application/employee.application.module'

@Module({
  imports: [EmployeeApplicationModule],
  controllers: [],
  providers: [EmployeeResolver],
  exports: [],
})
export class EmployeeInfrastructureModule {}
