import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { GroqProvider } from './providers/groq.provider';
import { ChatbotToolsExecutor } from './tools/chatbot-tools.executor';
import { ExpenseModule } from '../expense/expense.module';
import { ApartmentModule } from '../apartment/apartment.module';

@Module({
  imports: [ExpenseModule, ApartmentModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, GroqProvider, ChatbotToolsExecutor],
  exports: [ChatbotService],
})
export class ChatbotModule {}
