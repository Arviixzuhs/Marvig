import { NotificationPage } from '@/modules/notification/application/dto/notification-page.dto'
import { NotificationModel } from '@/modules/notification/domain/models/notification.model'
import { NotificationFilterDto } from '@/modules/notification/application/dto/notification-filter.dto'
import { CreateNotificationDto } from '@/modules/notification/application/dto/create-notification.dto'

export interface NotificationRepositoryPort {
  findNotifications(filters: NotificationFilterDto): Promise<NotificationPage>
  createNotification(data: CreateNotificationDto): Promise<NotificationModel>
}
