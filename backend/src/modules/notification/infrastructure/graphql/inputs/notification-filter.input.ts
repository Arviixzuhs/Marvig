import { DateFilterInput } from '@/common/graphql/inputs/date-filter.input'
import { NotificationType } from '@/modules/notification/domain/enums/notification-type.enum'
import { NotificationStatus } from '@/modules/notification/domain/enums/notification-status.enum'
import { IsEnum, IsOptional } from 'class-validator'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { Field, InputType, IntersectionType } from '@nestjs/graphql'

@InputType()
export class NotificationFilterInput extends IntersectionType(
  PaginationFilterInput,
  DateFilterInput,
) {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus
}
