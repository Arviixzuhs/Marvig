import { Inject, Injectable } from '@nestjs/common'
import { NotificationRepositoryPort } from '@/modules/notification/domain/repositories/notification.repository.port'

@Injectable()
export class GetUnreadNotificationsCountUseCase {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async execute(userId?: number): Promise<number> {
    const result = await this.notificationRepository.getUnreadNotificationsCount(userId)

    return result
  }
}
