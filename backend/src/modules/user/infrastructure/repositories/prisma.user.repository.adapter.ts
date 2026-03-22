import { UserDto } from '@/modules/user/application/dto/user.dto'
import { UserModel } from '@/modules/user/domain/models/user.model'
import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'

@Injectable()
export class PrismaUserRepositoryAdapter implements UserRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  async createUser(data: UserModel): Promise<UserModel> {
    const createdUser = await this.prisma.user.create({
      data: { ...data },
    })
    return createdUser
  }

  async findUsers(): Promise<UserModel[]> {
    return await this.prisma.user.findMany()
  }

  async deleteUser(userId: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    })
  }

  async updateUser(userId: number, newData: UserDto): Promise<UserModel> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: newData,
    })

    return updatedUser
  }

  async findUser(userId: number): Promise<UserModel> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    return user
  }
}
