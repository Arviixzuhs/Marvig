import { Prisma } from 'generated/prisma/client'
import { UserRole } from '@/common/enums/user-role.enum'
import { NotificationType } from '@/modules/notification/domain/enums/notification-type.enum'
import { NotificationStatus } from '@/modules/notification/domain/enums/notification-status.enum'

export interface NotificationSpecificationBuild {
  where: Prisma.NotificationWhereInput
  skip?: number
  take?: number
  orderBy?: Prisma.NotificationOrderByWithRelationInput
}

export class NotificationSpecificationBuilder {
  private where: Prisma.NotificationWhereInput = {}
  private skip?: number
  private take?: number
  private orderBy?: Prisma.NotificationOrderByWithRelationInput

  withType(type: NotificationType) {
    if (type) {
      this.where.type = type
    }
    return this
  }

  withStatus(status: NotificationStatus) {
    if (status) {
      this.where.status = status
    }
    return this
  }

  withUserTargetRole(userTargetRole: UserRole) {
    if (userTargetRole) {
      this.where.userTargetRole = userTargetRole
    }
    return this
  }

  withUserId(userId: number) {
    if (userId) {
      this.where.userId = userId
    }
    return this
  }

  withDateBetween(fromDate?: string, toDate?: string) {
    if (fromDate || toDate) {
      this.where.createdAt = {
        ...(fromDate && { gte: new Date(fromDate) }),
        ...(toDate && { lte: new Date(toDate) }),
      }
    }
    return this
  }

  withPagination(page: number = 0, pageSize: number = 10) {
    this.skip = page * pageSize
    this.take = pageSize
    return this
  }

  withOrderBy(orderBy?: Prisma.NotificationOrderByWithRelationInput) {
    if (orderBy) {
      this.orderBy = orderBy
    }
    return this
  }

  build(): NotificationSpecificationBuild {
    return {
      where: this.where,
      skip: this.skip,
      take: this.take,
      orderBy: this.orderBy,
    }
  }
}
