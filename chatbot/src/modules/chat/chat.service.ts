import { Chat } from '@prisma/client'
import { ChatDto } from './dto/chat.dto'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async findBy(id: string, userId: number) {
    const chat = await this.prisma.chat.findFirst({
      where: { id },
      include: { user: true },
    })

    if (!chat) {
      throw new NotFoundException('Chat not found')
    }

    if (chat.user.userId !== userId) {
      throw new NotFoundException('You do not have access to this chat')
    }

    return chat
  }

  async create(title: string, userId: number): Promise<Chat> {
    const user = await this.prisma.user.findUnique({
      where: {
        userId,
      },
    })

    if (!user) throw new NotFoundException('User not found')

    return this.prisma.chat.create({
      data: {
        title,
        userId: user.id,
      },
    })
  }

  async update(chatId: string, data: ChatDto) {
    return this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data,
    })
  }

  async updateTitle(chatId: string, userId: number, newTitle: string) {
    await this.findBy(chatId, userId)
    return this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        title: newTitle,
      },
    })
  }

  async deleteById(id: string, userId: number): Promise<string> {
    await this.findBy(id, userId)

    const today = new Date()
    await this.prisma.chat.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: today,
      },
    })

    return 'Chat deleted successfully'
  }

  createDefaultChat(userId: number): Promise<Chat> {
    return this.create('Bienvenid@, <%user%>', userId)
  }

  async findMyChats(userId: number): Promise<Chat[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        userId,
      },
    })

    if (!user) {
      await this.userService.create({
        userId,
      })
    }

    const chats = await this.prisma.chat.findMany({
      where: {
        user: {
          userId,
        },
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return chats
  }
}
