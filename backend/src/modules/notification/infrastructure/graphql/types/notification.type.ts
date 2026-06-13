import { NotificationStatus } from '@/modules/notification/domain/enums/notification-status.enum'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { NotificationType as NotificationTypeEnum } from '@/modules/notification/domain/enums/notification-type.enum'

@ObjectType()
export class NotificationType {
  @Field()
  id: number

  @Field(() => NotificationTypeEnum)
  type: NotificationTypeEnum

  @Field()
  body: string

  @Field()
  title: string

  @Field(() => NotificationStatus)
  status: NotificationStatus

  @Field({ nullable: true })
  payload: string

  @Field({ nullable: true })
  userId?: number

  @Field({ nullable: true })
  createdAt?: Date | null

  @Field({ nullable: true })
  updatedAt?: Date | null
}

registerEnumType(NotificationStatus, {
  name: 'NotificationStatus',
  description: 'Estados disponibles para las notificaciones (Notifications)',
})

registerEnumType(NotificationTypeEnum, {
  name: 'NotificationTypeEnum',
  description: 'Tipos disponibles para las notificaciones (Notifications)',
})
