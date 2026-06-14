import { Inject, Injectable } from '@nestjs/common'
import { NotificationRepositoryPort } from '@/modules/notification/domain/repositories/notification.repository.port'

@Injectable()
export class MarkNotificationsAsReadUseCase {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async execute(userId: number): Promise<void> {
    await this.notificationRepository.markNotificationsAsRead(userId)
  }
}
