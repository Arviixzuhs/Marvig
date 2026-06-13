import { NotificationType } from '@/modules/notification/domain/enums/notification-type.enum'
import { NotificationStatus } from '@/modules/notification/domain/enums/notification-status.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator'

@InputType()
export class NotificationFilterInput extends PaginationFilterInput {
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

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fromDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  toDate?: string
}
