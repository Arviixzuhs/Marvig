import { Module } from '@nestjs/common'
import { ChatService } from '@/modules/chat/chat.service'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'
import { MessageService } from '@/modules/messages/messages.service'
import { MarvigAIService } from './bot.service'
import { MarvigAIController } from './bot.controller'

@Module({
  controllers: [MarvigAIController],
  providers: [MarvigAIService, PrismaService, ChatService, UserService, MessageService],
})
export class MarvigAIModule {}
