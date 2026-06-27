import { UserRole } from '@/common/enums/user-role.enum'
import { DateFilterInput } from '@/common/graphql/inputs/date-filter.input'
import { NotificationType } from '@/modules/notification/domain/enums/notification-type.enum'
import { NotificationStatus } from '@/modules/notification/domain/enums/notification-status.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { IsEnum, IsInt, IsOptional } from 'class-validator'
import { Field, InputType, Int, IntersectionType } from '@nestjs/graphql'

@InputType()
export class NotificationFilterInput extends IntersectionType(
  PaginationFilterInput,
  DateFilterInput,
) {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  userId?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  userTargetRole?: UserRole
}
