import { User } from '@/interfaces/user.interface'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { NotificationType } from '@/modules/notification/infrastructure/graphql/types/notification.type'
import { NotificationPageType } from '@/modules/notification/infrastructure/graphql/types/notification-page.type'
import { NotificationFilterInput } from '@/modules/notification/infrastructure/graphql/inputs/notification-filter.input'
import { FindNotificationsUseCase } from '@/modules/notification/application/usecases/find-notifications.usecase'
import { MarkNotificationsAsReadUseCase } from '@/modules/notification/application/usecases/mark-notifications-as-read.usecase'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetUnreadNotificationsCountUseCase } from '@/modules/notification/application/usecases/get-unread-notifications-count.usecase'

@Resolver(() => NotificationType)
export class NotificationResolver {
  constructor(
    private readonly findNotificationsUseCase: FindNotificationsUseCase,
    private readonly markNotificationsAsReadUseCase: MarkNotificationsAsReadUseCase,
    private readonly getUnreadNotificationsCountUseCase: GetUnreadNotificationsCountUseCase,
  ) { }

  @Query(() => NotificationPageType)
  findNotifications(
    @CurrentUser() user: User,
    @Args('filters') filters: NotificationFilterInput,
  ): Promise<NotificationPageType> {
    return this.findNotificationsUseCase.execute(filters, user.userId)
  }

  @Query(() => Number)
  getUnreadNotificationsCount(@CurrentUser() user: User): Promise<number> {
    return this.getUnreadNotificationsCountUseCase.execute(user.userId)
  }

  @Mutation(() => String)
  async markNotificationsAsRead(@CurrentUser() user: User): Promise<String> {
    await this.markNotificationsAsReadUseCase.execute(user.userId)
    return 'Notificaciones leidas correctamente'
  }
}
