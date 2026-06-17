import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma/prisma.service'
import { ChatController } from './chat.controller'

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService, UserService],
})
export class ChatModule {}
