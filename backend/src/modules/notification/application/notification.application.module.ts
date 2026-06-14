import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindNotificationsUseCase } from './usecases/find-notifications.usecase'
import { CreateNotificationUseCase } from './usecases/create-notification.usecase'
import { MarkNotificationsAsReadUseCase } from './usecases/mark-notifications-as-read.usecase'
import { GetUnreadNotificationsCountUseCase } from './usecases/get-unread-notifications-count.usecase'
import { PrismaNotificationRepositoryAdapter } from '@/modules/notification/infrastructure/repositories/prisma.notification.repository.adapter'

config()

@Module({
  imports: [],
  providers: [
    {
      provide: PrismaClient,
      useValue: new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
      }),
    },
    FindNotificationsUseCase,
    CreateNotificationUseCase,
    MarkNotificationsAsReadUseCase,
    GetUnreadNotificationsCountUseCase,
    {
      provide: 'NotificationRepository',
      useClass: PrismaNotificationRepositoryAdapter,
    },
  ],
  exports: [
    CreateNotificationUseCase,
    FindNotificationsUseCase,
    MarkNotificationsAsReadUseCase,
    GetUnreadNotificationsCountUseCase,
  ],
})
export class NotificationApplicationModule {}
