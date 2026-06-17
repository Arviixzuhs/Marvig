import { APP_GUARD } from '@nestjs/core'
import { UserModule } from '@/modules/user/user.module'
import { ChatModule } from '@/modules/chat/chat.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { MessageModule } from '@/modules/messages/messages.module'
import { AppController } from '@/app.controller'
import { MarvigAIModule } from '@/modules/bot/bot.module'
import { AuthMiddleware } from '@/middlewares/auth.middleware'
import { ChatController } from '@/modules/chat/chat.controller'
import { UserController } from './modules/user/user.controller'
import { MarvigAIController } from '@/modules/bot/bot.controller'
import { MessageController } from '@/modules/messages/messages.controller'
import { RequestLoggerMiddleware } from '@/middlewares/request.logger.middleware'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

@Module({
  imports: [
    ChatModule,
    UserModule,
    PrismaModule,
    MarvigAIModule,
    MessageModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(MarvigAIController, MessageController, ChatController, UserController)
    consumer.apply(RequestLoggerMiddleware).forRoutes('*')
  }
}
