import { NotificationPage } from '@/modules/notification/application/dto/notification-page.dto'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'
import { NotificationFilterDto } from '@/modules/notification/application/dto/notification-filter.dto'
import { NotificationRepositoryPort } from '@/modules/notification/domain/repositories/notification.repository.port'
import { ForbiddenException, Inject, Injectable } from '@nestjs/common'

@Injectable()
export class FindNotificationsUseCase {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepositoryPort,

    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(filters: NotificationFilterDto, userId?: number): Promise<NotificationPage> {
    if (userId && filters.userTargetRole) {
      const user = await this.userRepository.findUser(userId)
      if (user.role !== filters.userTargetRole) {
        throw new ForbiddenException('No tienes permisos para ver estas notificaciones')
      }
    }

    const result = await this.notificationRepository.findNotifications(filters, userId)

    return result
  }
}
