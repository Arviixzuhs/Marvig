import { UserRole } from '@/common/enums/user-role.enum'
import { NotificationPage } from '@/modules/notification/application/dto/notification-page.dto'
import { Inject, Injectable } from '@nestjs/common'
import { NotificationFilterDto } from '@/modules/notification/application/dto/notification-filter.dto'
import { NotificationRepositoryPort } from '@/modules/notification/domain/repositories/notification.repository.port'

@Injectable()
export class FindNotificationsUseCase {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async execute(
    filters: NotificationFilterDto,
    userId: number,
    role: UserRole,
  ): Promise<NotificationPage> {
    return this.notificationRepository.findNotifications(filters, userId, role)
  }
}
