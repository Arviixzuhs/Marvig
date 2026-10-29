import { UserRole } from '@/common/enums/user-role.enum'
import { Inject, Injectable } from '@nestjs/common'
import { NotificationRepositoryPort } from '@/modules/notification/domain/repositories/notification.repository.port'

@Injectable()
export class GetUnreadNotificationsCountUseCase {
  constructor(
    @Inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async execute(userId: number, role: UserRole): Promise<number> {
    const result = await this.notificationRepository.getUnreadNotificationsCount(userId, role)

    return result
  }
}
