import { Controller, Post, Body, Req, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatRequestDto } from './interfaces/types';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import * as jwt from 'jsonwebtoken';


@Controller('chatbot')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Post('message')
  async handleMessage(@Body() request: ChatRequestDto, @Req() req: Request) {
    const authHeader = req.headers.authorization;
    let user: any = null;
    let userToken: string | undefined = undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      userToken = authHeader.split(' ')[1];
      try {
        const secret = this.configService.get<string>('JWT_SECRET') || 'marvig_secret_token_change_me';
        user = jwt.verify(userToken, secret);
      } catch (error: any) {
        this.logger.warn(`Token JWT inválido o expirado: ${error.message}`);
      }
    }

    return await this.appService.processMessage(request, user, userToken);
  }
}
