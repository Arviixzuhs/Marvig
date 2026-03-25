import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindApartamentUseCase } from './usecases/find-apartament.usecase'
import { FindApartamentsUseCase } from './usecases/find-apartaments.usecase'
import { CreateApartamentUseCase } from './usecases/create-apartament.usecase'
import { UpdateApartamentUseCase } from './usecases/update-apartament.usecase'
import { DeleteApartamentUseCase } from './usecases/delete-apartament.usecase'
import { UpdateApartamentStatusUseCase } from './usecases/update-apartament-status.usecase'
import { PrismaApartamentRepositoryAdapter } from '@/modules/apartament/infrastructure/repositories/prisma.apartament.repository.adapter'

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
    FindApartamentUseCase,
    FindApartamentsUseCase,
    CreateApartamentUseCase,
    UpdateApartamentUseCase,
    DeleteApartamentUseCase,
    UpdateApartamentStatusUseCase,
    {
      provide: 'ApartamentRepository',
      useClass: PrismaApartamentRepositoryAdapter,
    },
  ],
  exports: [
    FindApartamentUseCase,
    FindApartamentsUseCase,
    CreateApartamentUseCase,
    UpdateApartamentUseCase,
    DeleteApartamentUseCase,
    UpdateApartamentStatusUseCase,
  ],
})
export class ApartamentApplicationModule {}
