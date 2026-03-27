import { AppController } from '@/app.controller'
import { AppResolver } from '@/app.resolver'
import { AuthMiddleware } from '@/middlewares/auth.middleware'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ApartmentModule } from '@/modules/apartment/apartment.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { EmployeeModule } from '@/modules/employee/employee.module'
import { ReservationModule } from '@/modules/reservation/reservation.module'
import { UserModule } from '@/modules/user/user.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { ApolloDriver } from '@nestjs/apollo'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { GraphQLModule } from '@nestjs/graphql'
import { ThrottlerModule } from '@nestjs/throttler'
import { config } from 'dotenv'
import { join } from 'path'
import { FileModule } from './modules/file/file.module'
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard'

config()
@Module({
  imports: [
    FileModule,
    UserModule,
    AuthModule,
    PrismaModule,
    EmployeeModule,
    ApartmentModule,
    ReservationModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        setHeaders: (res, path) => {
          const ext = path.split('.').pop()?.toLowerCase()
          const mimeTypes: Record<string, string> = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp',
            gif: 'image/gif',
          }
          if (ext && mimeTypes[ext]) {
            res.setHeader('Content-Type', mimeTypes[ext])
          }
        },
      },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
      driver: ApolloDriver,
      path: '/graphql',
      debug: process.env['SERVER_MODE'] === 'DEVELOPMENT',
      playground: process.env['SERVER_MODE'] === 'DEVELOPMENT',
      csrfPrevention: false,
      context: ({ req, res }) => ({ req, res, user: req.user }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppResolver,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        'auth/login',
        'auth/register',
        '/api',
        'graphql',
        'file/upload',
        'file/uploads',
        '/uploads/(.*)',
      )
      .forRoutes('*')
  }
}
