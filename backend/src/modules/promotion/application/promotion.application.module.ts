import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { FindPromotionUseCase } from './usecases/find-promotion.usecase'
import { FindPromotionsUseCase } from './usecases/find-promotions.usecase'
import { CreatePromotionUseCase } from './usecases/create-promotion.usecase'
import { UpdatePromotionUseCase } from './usecases/update-promotion.usecase'
import { DeletePromotionUseCase } from './usecases/delete-promotion.usecase'
import { PrismaPromotionRepositoryAdapter } from '@/modules/promotion/infrastructure/repositories/prisma.promotion.repository.adapter'

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
    FindPromotionUseCase,
    UpdatePromotionUseCase,
    DeletePromotionUseCase,
    FindPromotionsUseCase,
    CreatePromotionUseCase,
    {
      provide: 'PromotionRepository',
      useClass: PrismaPromotionRepositoryAdapter,
    },
  ],
  exports: [
    FindPromotionUseCase,
    UpdatePromotionUseCase,
    DeletePromotionUseCase,
    FindPromotionsUseCase,
    CreatePromotionUseCase,
  ],
})
export class PromotionApplicationModule {}
