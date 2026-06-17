import { Module } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { MessageService } from './messages.service'
import { MessageController } from './messages.controller'

@Module({
  controllers: [MessageController],
  providers: [MessageService, PrismaService],
})
export class MessageModule {}
