import { Module } from '@nestjs/common'
import { VerificationCodeDomainModule } from './domain/verificationCode.domain.module'
import { VerificationCodeApplicationModule } from './application/verificationCode.application.module'
import { VerificationCodeInfrastructureModule } from './infrastructure/infrastructure.module'

@Module({
  imports: [
    VerificationCodeDomainModule,
    VerificationCodeApplicationModule,
    VerificationCodeInfrastructureModule,
  ],
  controllers: [],
  providers: [],
})
export class VerificationCodeModule {}
