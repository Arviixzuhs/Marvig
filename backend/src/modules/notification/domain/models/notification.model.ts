import { NotificationStatus } from '@/modules/notification/domain/enums/notification-status.enum'
import { NotificationType } from '@/modules/notification/domain/enums/notification-type.enum'

export class NotificationModel {
  id: number
  type: NotificationType
  body: string
  title: string
  status: NotificationStatus
  payload: string
  userId?: number
  createdAt?: Date | null
  updatedAt?: Date | null
}
