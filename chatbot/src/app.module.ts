import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroqProvider } from './providers/groq.provider';
import { ToolsExecutor } from './tools/tools.executor';
import { BackendClientService } from './services/backend-client.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GroqProvider,
    ToolsExecutor,
    BackendClientService,
  ],
})
export class AppModule {}
