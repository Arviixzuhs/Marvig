import { Module } from '@nestjs/common'
import { NotificationResolver } from '@/modules/notification/infrastructure/graphql/resolvers/notification.resolver'
import { NotificationApplicationModule } from '@/modules/notification/application/notification.application.module'

@Module({
  imports: [NotificationApplicationModule],
  controllers: [],
  providers: [NotificationResolver],
  exports: [],
})
export class NotificationInfrastructureModule {}
