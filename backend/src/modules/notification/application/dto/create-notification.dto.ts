import { UserRole } from '@/common/enums/user-role.enum'
import { NotificationType } from '@/modules/notification/domain/enums/notification-type.enum'
import { NotificationStatus } from '@/modules/notification/domain/enums/notification-status.enum'

export class CreateNotificationDto {
  body: string
  type: NotificationType
  title: string
  status: NotificationStatus
  userId?: number
  payload?: string
  userTargetRole?: UserRole
}
