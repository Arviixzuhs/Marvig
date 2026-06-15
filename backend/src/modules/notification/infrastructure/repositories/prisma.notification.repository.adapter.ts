import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { NotificationMapper } from '@/modules/notification/infrastructure/mapper/notification.mapper'
import { NotificationStatus } from '@/modules/notification/domain/enums/notification-status.enum'
import { NotificationFilterDto } from '@/modules/notification/application/dto/notification-filter.dto'
import { CreateNotificationDto } from '@/modules/notification/application/dto/create-notification.dto'
import { NotificationRepositoryPort } from '@/modules/notification/domain/repositories/notification.repository.port'
import { NotificationSpecificationBuilder } from '@/modules/notification/infrastructure/repositories/prisma.notification.specificationBuilder'

@Injectable()
export class PrismaNotificationRepositoryAdapter implements NotificationRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  private readonly notificationMapper = new NotificationMapper()

  async findNotifications(filters: NotificationFilterDto, userId?: number) {
    const query = new NotificationSpecificationBuilder()
      .withType(filters.type)
      .withStatus(filters.status)
      .withUserId(userId)
      .withUserTargetRole(filters.userTargetRole)
      .withDateBetween(filters.fromDate, filters.toDate)
      .withPagination(filters.page, filters.pageSize, filters.isUnpaged)
      .withOrderBy({ createdAt: 'desc' })
      .build()

    const [notifications, notificationsCount] = await this.prisma.$transaction([
      this.prisma.notification.findMany(query),
      this.prisma.notification.count({
        where: query.where,
      }),
    ])

    return {
      content: this.notificationMapper.modelsToDomain(notifications),
      totalPages: Math.ceil(notificationsCount / query.take),
      totalItems: notificationsCount,
      currentPage: filters.page,
      rowsPerPage: query.take,
    }
  }

  async createNotification(data: CreateNotificationDto) {
    const createdNotification = await this.prisma.notification.create({
      data: {
        body: data.body,
        type: data.type,
        title: data.title,
        status: data.status,
        userId: data.userId,
        payload: data.payload,
        userTargetRole: data.userTargetRole,
      },
    })

    return this.notificationMapper.modelToDomain(createdNotification)
  }

  async markNotificationsAsRead(userId: number): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        status: NotificationStatus.UNREAD,
      },
      data: {
        status: NotificationStatus.READ,
      },
    })
  }

  async getUnreadNotificationsCount(userId?: number): Promise<number> {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        status: NotificationStatus.UNREAD,
      },
    })

    return count
  }
}
