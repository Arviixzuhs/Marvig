import { Message } from '@prisma/client'
import { Request } from 'express'
import { MessageService } from './messages.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { FindByChatIdParamsDto } from './dto/find-by-chatid-params.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Post, Body, Req, Query } from '@nestjs/common'

@ApiTags('Messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  create(@Body() dto: CreateMessageDto): Promise<Message> {
    return this.messageService.create(dto)
  }

  @Get('chat')
  @ApiOperation({ summary: 'Get messages by chat ID with pagination' })
  @ApiResponse({ status: 200, description: 'List of messages with pagination' })
  findByChatId(@Query() query: FindByChatIdParamsDto, @Req() req: Request): Promise<Message[]> {
    const { chatId, page, size } = query
    return this.messageService.findByChatId(chatId, req.user, page, size)
  }
}
