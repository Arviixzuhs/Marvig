import { UserModel } from '@/modules/user/domain/models/user.model'
import { UpdateUserDto } from '@/modules/user/application/dto/update-user.dto'
import { UpdateUserUseCase } from '@/modules/user/application/usecases/update-user.usecase'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UpdateMyProfileUseCase {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  async execute(userId: number, data: Partial<UpdateUserDto>): Promise<UserModel> {
    // Allow only safe fields — prevents escalation (e.g. role, email, password)
    const { name, lastName, phone, avatar } = data
    const updateData: Partial<UpdateUserDto> = {}
    if (name !== undefined) updateData.name = name
    if (lastName !== undefined) updateData.lastName = lastName
    if (phone !== undefined) updateData.phone = phone
    if (avatar !== undefined) updateData.avatar = avatar

    return this.updateUserUseCase.execute(userId, updateData as UpdateUserDto)
  }
}
