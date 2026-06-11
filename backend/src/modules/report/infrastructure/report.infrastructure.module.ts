import { Module } from '@nestjs/common'
import { ReportApplicationModule } from '@/modules/report/application/report.application.module'
import { ReportResolver } from '@/modules/report/infrastructure/graphql/resolvers/report.resolver'

@Module({
  imports: [ReportApplicationModule],
  providers: [ReportResolver],
})
export class ReportInfrastructureModule {}
