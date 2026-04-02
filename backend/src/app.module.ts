import { join } from 'path'
import { config } from 'dotenv'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from '@/modules/auth/auth.module'
import { UserModule } from '@/modules/user/user.module'
import { FileModule } from '@/modules/file/file.module'
import { AppResolver } from '@/app.resolver'
import { PrismaModule } from '@/prisma/prisma.module'
import { ApolloDriver } from '@nestjs/apollo'
import { AppController } from '@/app.controller'
import { ExpenseModule } from '@/modules/expense/expense.module'
import { PaymentModule } from '@/modules/payment/payment.module'
import { GraphQLModule } from '@nestjs/graphql'
import { EmployeeModule } from '@/modules/employee/employee.module'
import { AuthMiddleware } from '@/middlewares/auth.middleware'
import { ApartmentModule } from '@/modules/apartment/apartment.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { PromotionModule } from '@/modules/promotion/promotion.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ReservationModule } from '@/modules/reservation/reservation.module'
import { GqlThrottlerGuard } from '@/common/guards/gql-throttler.guard'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

config()
@Module({
  imports: [
    FileModule,
    UserModule,
    AuthModule,
    PrismaModule,
    ExpenseModule,
    PaymentModule,
    EmployeeModule,
    PromotionModule,
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
        '/stripe/(.*)',
        '/api',
        'graphql',
        'file/upload',
        'file/uploads',
        '/uploads/(.*)',
      )
      .forRoutes('*')
  }
}
