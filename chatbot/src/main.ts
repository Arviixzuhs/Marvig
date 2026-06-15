import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Accept,Authorization,X-Bot-Api-Key',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Servicio Chatbot NestJS corriendo en el puerto: ${port}`);
}
bootstrap();
