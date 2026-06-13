import { PageType } from '@/common/dto/page-response.dto'
import { ObjectType } from '@nestjs/graphql'
import { NotificationType } from './notification.type'

@ObjectType()
export class NotificationPageType extends PageType(NotificationType) {}
