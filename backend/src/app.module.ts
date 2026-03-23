import { join } from 'path'
import { config } from 'dotenv'
import { APP_GUARD } from '@nestjs/core'
import { UserModule } from '@/modules/user/user.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { AppResolver } from '@/app.resolver'
import { ApolloDriver } from '@nestjs/apollo'
import { PrismaModule } from '@/prisma/prisma.module'
import { GraphQLModule } from '@nestjs/graphql'
import { AppController } from '@/app.controller'
import { AuthMiddleware } from '@/middlewares/auth.middleware'
import { EmployeeModule } from '@/modules/employee/employee.module'
import { ApartamentModule } from '@/modules/apartament/apartament.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

config()
@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    EmployeeModule,
    ApartamentModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
      driver: ApolloDriver,
      path: '/graphql',
      debug: process.env['SERVER_MODE'] === 'DEVELOPMENT',
      playground: process.env['SERVER_MODE'] === 'DEVELOPMENT',
      csrfPrevention: false,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppResolver,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('auth/login', 'auth/register', '/api').forRoutes('*')
  }
}
