import { Controller, Post, Body, Req } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatRequestDto } from './interfaces/chatbot.interface';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  async handleMessage(@Body() request: ChatRequestDto, @Req() req: any) {
    const user = req.user;
    return await this.chatbotService.processMessage(request, user);
  }
}
