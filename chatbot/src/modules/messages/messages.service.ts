import { User } from '@/interfaces/user.interface'
import { Message } from '@prisma/client'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMessageDto): Promise<Message> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: data.chatId,
        isDeleted: false,
      },
    })

    if (!chat) {
      throw new NotFoundException('Chat not found')
    }

    return this.prisma.message.create({ data })
  }

  async findLastContextMessages(chatId: string, limit = 8): Promise<Message[]> {
    return this.prisma.message
      .findMany({
        where: {
          chatId,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
      .then((m) => m.reverse())
  }

  async findByChatId(chatId: string, user: User, page = 1, size = 20) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
        isDeleted: false,
      },
      include: {
        user: true,
      },
    })

    if (!chat) throw new NotFoundException('Chat not found')

    if (chat.user.userId !== user.userId)
      throw new NotFoundException('You do not have access to this chat')

    const totalMessages = await this.prisma.message.count({
      where: {
        chatId,
      },
    })

    const messagesFromEnd = page * size
    const skip = Math.max(0, totalMessages - messagesFromEnd)
    const take = Math.min(size, totalMessages - (page - 1) * size)

    if (take <= 0) return []

    const messages = await this.prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip,
      take,
    })

    return messages
  }
}
