import { UserPage } from '@/modules/user/application/dto/user-page.dto'
import { UserModel } from '@/modules/user/domain/models/user.model'
import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { UpdateUserDto } from '@/modules/user/application/dto/update-user.dto'
import { UserFilterDto } from '@/modules/user/application/dto/user-filter.dto'
import { UserRepositoryPort } from '@/modules/user/domain/repositories/user.repository.port'
import { UserSpecificationBuilder } from './prisma.user.specificationBuilder'

@Injectable()
export class PrismaUserRepositoryAdapter implements UserRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  async createUser(data: UserModel): Promise<UserModel> {
    const createdUser = await this.prisma.user.create({
      data: { ...data },
    })
    return createdUser
  }

  async findUsers(filters: UserFilterDto): Promise<UserPage> {
    const query = new UserSpecificationBuilder()
      .withSearch(filters.search)
      .withName(filters.name)
      .withEmail(filters.email)
      .withCreatedAtBetween(filters.fromDate, filters.toDate)
      .withPagination(filters.page, filters.pageSize)
      .withOrderBy({ createdAt: 'desc' })
      .build()

    const [users, totalItems] = await this.prisma.$transaction([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ])

    return {
      content: users,
      totalItems,
      totalPages: Math.ceil(totalItems / (query.take || 10)),
      currentPage: filters.page,
      rowsPerPage: query.take,
    }
  }

  async deleteUser(userId: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    })
  }

  async updateUser(userId: number, newData: UpdateUserDto): Promise<UserModel> {
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
