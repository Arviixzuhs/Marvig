import { config } from 'dotenv'
import { Module } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'
import { CreateVarificationCodeUseCase } from './usecases/create-verification-code.usecase'
import { ValidateVarificationCodeUseCase } from './usecases/validate-verification-code.usecase'
import { PrismaVerificationCodeRepositoryAdapter } from '@/modules/verificationCode/infrastructure/repositories/prisma.verificationCode.repository.adapter'

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
    CreateVarificationCodeUseCase,
    ValidateVarificationCodeUseCase,
    {
      provide: 'VerificationCodeRepository',
      useClass: PrismaVerificationCodeRepositoryAdapter,
    },
  ],
  exports: [CreateVarificationCodeUseCase, ValidateVarificationCodeUseCase],
})
export class VerificationCodeApplicationModule {}
