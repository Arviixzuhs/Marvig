import { Module } from '@nestjs/common'
import { NotificationDomainModule } from './domain/notification.domain.module'
import { NotificationApplicationModule } from './application/notification.application.module'
import { NotificationInfrastructureModule } from './infrastructure/notification.infrastructure.module'

@Module({
  imports: [
    NotificationDomainModule,
    NotificationApplicationModule,
    NotificationInfrastructureModule,
  ],
  controllers: [],
  providers: [],
})
export class NotificationModule {}
