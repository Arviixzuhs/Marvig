import { PageType } from '@/common/dto/page-response.dto'
import { NotificationModel } from '@/modules/notification/domain/models/notification.model'

export class NotificationPage extends PageType(NotificationModel) {}
