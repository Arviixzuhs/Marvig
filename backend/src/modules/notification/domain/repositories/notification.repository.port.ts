import { UserRole } from '@/common/enums/user-role.enum'
import { NotificationPage } from '@/modules/notification/application/dto/notification-page.dto'
import { NotificationModel } from '@/modules/notification/domain/models/notification.model'
import { NotificationFilterDto } from '@/modules/notification/application/dto/notification-filter.dto'
import { CreateNotificationDto } from '@/modules/notification/application/dto/create-notification.dto'

export interface NotificationRepositoryPort {
  findNotifications(
    filters: NotificationFilterDto,
    userId: number,
    role: UserRole,
  ): Promise<NotificationPage>
  createNotification(data: CreateNotificationDto): Promise<NotificationModel>
  markNotificationsAsRead(userId: number, role: UserRole): Promise<void>
  getUnreadNotificationsCount(userId: number, role: UserRole): Promise<number>
}
