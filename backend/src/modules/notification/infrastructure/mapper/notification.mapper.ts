import { BaseMapper } from '@/common/mappers/base.mapper'
import { NotificationType } from '@/modules/notification/domain/enums/notification-type.enum'
import { NotificationModel } from '@/modules/notification/domain/models/notification.model'
import { NotificationStatus } from '@/modules/notification/domain/enums/notification-status.enum'
import { Notification as PrismaNotification } from 'generated/prisma/client'

export class NotificationMapper extends BaseMapper<PrismaNotification, NotificationModel> {
  modelToDomain(model: PrismaNotification): NotificationModel {
    return {
      id: model.id,
      type: model.type as NotificationType,
      body: model.body,
      title: model.title,
      status: model.status as NotificationStatus,
      payload: String(model.payload),
      userId: model.userId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
