import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindSeasonsUseCase } from './usecases/find-seasons.usecase'
import { CreateSeasonUseCase } from './usecases/create-season.usecase'
import { UpdateSeasonUseCase } from './usecases/update-season.usecase'
import { DeleteSeasonUseCase } from './usecases/delete-season.usecase'
import { FindSeasonByIdUseCase } from './usecases/find-season-by-id.usecase'
import { SeasonValidationService } from './services/season-validation.service'
import { PrismaSeasonRepositoryAdapter } from '@/modules/season/infrastructure/repositories/prisma.season.repository.adapter'

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
    SeasonValidationService,
    FindSeasonsUseCase,
    FindSeasonByIdUseCase,
    CreateSeasonUseCase,
    UpdateSeasonUseCase,
    DeleteSeasonUseCase,
    {
      provide: 'SeasonRepository',
      useClass: PrismaSeasonRepositoryAdapter,
    },
  ],
  exports: [
    FindSeasonsUseCase,
    FindSeasonByIdUseCase,
    CreateSeasonUseCase,
    UpdateSeasonUseCase,
    DeleteSeasonUseCase,
  ],
})
export class SeasonApplicationModule {}
