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

  async execute(data: NotificationFilterDto): Promise<NotificationPage> {
    const result = await this.notificationRepository.findNotifications(data)

    return result
  }
}
