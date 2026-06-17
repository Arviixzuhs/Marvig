import { Chat } from '@prisma/client'
import { Request } from 'express'
import { ChatService } from './chat.service'
import { ChatTitleDto } from './dto/chat-title.dto'
import { IsObjectIdPipe } from '@/pipes/is-object-id.pipe'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Post, Body, Delete, Req, Param, Put } from '@nestjs/common'

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiResponse({ status: 201, description: 'Chat created successfully' })
  create(@Req() req: Request, @Body() dto: ChatTitleDto): Promise<Chat> {
    return this.chatService.create(dto.title, req.user.userId)
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get my chats' })
  @ApiResponse({ status: 200, description: 'List of chats for the user' })
  findMyChats(@Req() req: Request): Promise<Chat[]> {
    return this.chatService.findMyChats(req.user.userId)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update chat title' })
  @ApiResponse({ status: 200, description: 'Chat updated successfully' })
  updateChatTitlte(
    @Req() req: Request,
    @Param('id', IsObjectIdPipe) id: string,
    @Body() dto: ChatTitleDto,
  ) {
    return this.chatService.updateTitle(id, req.user.userId, dto.title)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete chat by id' })
  @ApiResponse({ status: 200, description: 'Chat deleted successfully' })
  deleteById(@Req() req: Request, @Param('id', IsObjectIdPipe) id: string): Promise<string> {
    return this.chatService.deleteById(id, req.user.userId)
  }
}
