import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindApartmentUseCase } from './usecases/find-apartment.usecase'
import { FindApartmentsUseCase } from './usecases/find-apartments.usecase'
import { CreateApartmentUseCase } from './usecases/create-apartment.usecase'
import { UpdateApartmentUseCase } from './usecases/update-apartment.usecase'
import { DeleteApartmentUseCase } from './usecases/delete-apartment.usecase'
import { UpdateApartmentStatusUseCase } from './usecases/update-apartment-status.usecase'
import { PrismaApartmentRepositoryAdapter } from '@/modules/apartment/infrastructure/repositories/prisma.apartment.repository.adapter'

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
    FindApartmentUseCase,
    FindApartmentsUseCase,
    CreateApartmentUseCase,
    UpdateApartmentUseCase,
    DeleteApartmentUseCase,
    UpdateApartmentStatusUseCase,
    {
      provide: 'ApartmentRepository',
      useClass: PrismaApartmentRepositoryAdapter,
    },
  ],
  exports: [
    FindApartmentUseCase,
    FindApartmentsUseCase,
    CreateApartmentUseCase,
    UpdateApartmentUseCase,
    DeleteApartmentUseCase,
    UpdateApartmentStatusUseCase,
  ],
})
export class ApartmentApplicationModule {}
