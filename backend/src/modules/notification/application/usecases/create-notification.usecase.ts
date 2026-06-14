import { NotificationModel } from '@/modules/notification/domain/models/notification.model'
import { Inject, Injectable } from '@nestjs/common'
import { CreateNotificationDto } from '@/modules/notification/application/dto/create-notification.dto'
import { NotificationRepositoryPort } from '@/modules/notification/domain/repositories/notification.repository.port'

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async execute(data: CreateNotificationDto): Promise<NotificationModel> {
    const createdNotification = await this.notificationRepository.createNotification(data)

    return createdNotification
  }
}
