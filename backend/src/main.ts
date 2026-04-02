import { config } from 'dotenv'
import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import ValidationPipe from './pipes/validation.pipe'

import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

config()
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  })
  app.set('trust proxy', 'loopback')
  app.enableCors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription('Marvig API')
    .addBearerAuth()
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.use(cookieParser())
  app.useGlobalPipes(ValidationPipe)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
