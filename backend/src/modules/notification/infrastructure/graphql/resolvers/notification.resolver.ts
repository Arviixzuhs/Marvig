import { UserRole } from '@/common/enums/user-role.enum'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { NotificationType } from '@/modules/notification/infrastructure/graphql/types/notification.type'
import { NotificationPageType } from '@/modules/notification/infrastructure/graphql/types/notification-page.type'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { NotificationFilterInput } from '@/modules/notification/infrastructure/graphql/inputs/notification-filter.input'
import { FindNotificationsUseCase } from '@/modules/notification/application/usecases/find-notifications.usecase'
import { GetUnreadNotificationsCountUseCase } from '@/modules/notification/application/usecases/get-unread-notifications-count.usecase'

@Resolver(() => NotificationType)
export class NotificationResolver {
  constructor(
    private readonly findNotificationsUseCase: FindNotificationsUseCase,
    private readonly getUnreadNotificationsCountUseCase: GetUnreadNotificationsCountUseCase
  ) {}

  @Query(() => NotificationPageType)
  @RequiredRole(UserRole.ADMIN)
  findNotifications(
    @Args('filters') filters: NotificationFilterInput,
  ): Promise<NotificationPageType> {
    return this.findNotificationsUseCase.execute(filters)
  }

  @Query(() => Number)
  @RequiredRole(UserRole.ADMIN)
  getUnreadNotificationsCount(): Promise<number> {
    return this.getUnreadNotificationsCountUseCase.execute()
  }
}
