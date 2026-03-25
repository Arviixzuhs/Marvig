import { PageType } from '@/common/dto/page-response.dto'
import { UserModel } from '@/modules/user/domain/models/user.model'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserPage extends PageType(UserModel) {}
