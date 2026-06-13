import { NotificationType } from '@/modules/notification/infrastructure/graphql/types/notification.type'
import { NotificationPageType } from '@/modules/notification/infrastructure/graphql/types/notification-page.type'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { NotificationFilterInput } from '@/modules/notification/infrastructure/graphql/inputs/notification-filter.input'
import { FindNotificationsUseCase } from '@/modules/notification/application/usecases/find-notifications.usecase'

@Resolver(() => NotificationType)
export class NotificationResolver {
  constructor(private readonly findNotificationsUseCase: FindNotificationsUseCase) {}

  @Query(() => NotificationPageType)
  findNotifications(
    @Args('filters') filters: NotificationFilterInput,
  ): Promise<NotificationPageType> {
    return this.findNotificationsUseCase.execute(filters)
  }
}
