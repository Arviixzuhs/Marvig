import { Module } from '@nestjs/common'
import { DomainModule } from './domain/domain.module'
import { ApplicationModule } from './application/application.module'
import { InfrastructureModule } from './infrastructure/infrastructure.module'

@Module({
  imports: [DomainModule, ApplicationModule, InfrastructureModule],
  controllers: [],
  providers: [],
})
export class UserModule {}
