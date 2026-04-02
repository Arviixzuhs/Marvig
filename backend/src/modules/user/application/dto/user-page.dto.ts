import { PageType } from '@/common/dto/page-response.dto'
import { UserModel } from '@/modules/user/domain/models/user.model'

export class UserPage extends PageType(UserModel) {}
