import { NotificationType } from '@/modules/notification/domain/enums/notification-type.enum'
import { NotificationStatus } from '@/modules/notification/domain/enums/notification-status.enum'
import { PaginationFilterDto } from '@/common/dto/pagination-filter.dto'

export class NotificationFilterDto extends PaginationFilterDto {
  type?: NotificationType
  toDate?: string
  userId?: number
  status?: NotificationStatus
  fromDate?: string
}
