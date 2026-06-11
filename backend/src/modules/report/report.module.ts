import { Module } from '@nestjs/common'
import { ReportDomainModule } from '@/modules/report/domain/report.domain.module'
import { ReportApplicationModule } from '@/modules/report/application/report.application.module'
import { ReportInfrastructureModule } from '@/modules/report/infrastructure/report.infrastructure.module'

@Module({
  imports: [ReportDomainModule, ReportApplicationModule, ReportInfrastructureModule],
})
export class ReportModule {}
