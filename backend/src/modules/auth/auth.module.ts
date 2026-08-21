import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PrismaModule } from '@/prisma/prisma.module'
import { EmailService } from '@/common/utils/mail-sender.util'
import { AuthController } from './auth.controller'
import { VerificationCodeApplicationModule } from '../verificationCode/application/verificationCode.application.module'

@Module({
  imports: [PrismaModule, VerificationCodeApplicationModule],
  providers: [EmailService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
