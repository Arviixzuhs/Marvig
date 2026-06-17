import { User } from '@prisma/client'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateUserDto } from './dto/crate-user.dto'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data })
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ include: { chats: true } })
  }

  async getHello(userId: number): Promise<string> {
    const user: User = await this.prisma.user.findUnique({
      where: {
        userId,
      },
    })

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
    }

    return `Hola ${user.userId}`
  }
}
