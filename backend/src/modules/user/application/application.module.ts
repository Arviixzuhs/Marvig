import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindUserUseCase } from './usecases/find-user.usecase'
import { FindUsersUseCase } from './usecases/find-users.usecase'
import { CreateUserUseCase } from './usecases/create-user.usecase'
import { UpdateUserUseCase } from './usecases/update-user.usecase'
import { DeleteUserUseCase } from './usecases/delete-user.usecase'
import { PrismaUserRepositoryAdapter } from '@/modules/user/infrastructure/repositories/prisma.user.repository.adapter'

config()
@Module({
  imports: [],
  providers: [
    {
      provide: PrismaClient,
      useValue: new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
      }),
    },
    FindUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUsersUseCase,
    CreateUserUseCase,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepositoryAdapter,
    },
  ],
  exports: [
    FindUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUsersUseCase,
    CreateUserUseCase,
  ],
})
export class ApplicationModule {}
