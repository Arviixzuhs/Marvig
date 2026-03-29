import { PageType } from '@/common/dto/page-response.dto'
import { UserType } from '@/modules/user/infrastructure/graphql/types/user.type'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserPage extends PageType(UserType) {}
