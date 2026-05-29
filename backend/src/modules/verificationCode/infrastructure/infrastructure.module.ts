import { Module } from '@nestjs/common'
import { VerificationCodeResolver } from '@/modules/verificationCode/infrastructure/graphql/resolvers/verificationCode.resolver'
import { VerificationCodeApplicationModule } from '@/modules/verificationCode/application/verificationCode.application.module'

@Module({
  imports: [VerificationCodeApplicationModule],
  controllers: [],
  providers: [VerificationCodeResolver],
  exports: [],
})
export class VerificationCodeInfrastructureModule {}
