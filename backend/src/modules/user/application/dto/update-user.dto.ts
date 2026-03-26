import { InputType, PartialType } from '@nestjs/graphql'
import { UserDto } from './user.dto'

@InputType()
export class UpdateUserDto extends PartialType(UserDto) {}
