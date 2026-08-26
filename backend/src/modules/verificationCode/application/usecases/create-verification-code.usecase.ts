import * as crypto from 'crypto'
import { EmailService } from '@/common/utils/mail-sender.util'
import { VerificationCodeType } from '@/modules/verificationCode/domain/enums/verificationCode.enum'
import { VerificationCodeRepositoryPort } from '@/modules/verificationCode/domain/repositories/verificationCode.repository.port'
import { ConflictException, Inject, Injectable } from '@nestjs/common'

export interface VerificationEmailTemplate {
  subject: string
  title: string
  messageText: string
  expirationMinutes: number
}

const VERIFICATION_EMAIL_TEMPLATES: Record<
  VerificationCodeType,
  VerificationEmailTemplate
> = {
  [VerificationCodeType.VERIFY_EMAIL]: {
    subject: 'Confirmación de Correo - Posada Marvig',
    title: 'Confirma tu dirección de correo',
    messageText: 'Utiliza el siguiente código para verificar tu cuenta de correo:',
    expirationMinutes: 10,
  },
  [VerificationCodeType.PASSWORD_RESET]: {
    subject: 'Restablecimiento de Contraseña - Posada Marvig',
    title: 'Recuperación de contraseña',
    messageText: 'Utiliza el siguiente código para restablecer tu contraseña:',
    expirationMinutes: 5,
  },
}


@Injectable()
export class CreateVarificationCodeUseCase {
  constructor(
    @Inject('VerificationCodeRepository')
    private readonly verificationCodeRepository: VerificationCodeRepositoryPort,
    private readonly emailService: EmailService,
  ) {}

  async execute(type: VerificationCodeType, email: string): Promise<void> {
    const now = new Date()
    const latestCode = await this.verificationCodeRepository.findLastest(email, type)

    if (latestCode && now < latestCode.nextAllowedAt) {
      throw new ConflictException(`Debes esperar para solicitar un nuevo PIN.`)
    }

    const template = VERIFICATION_EMAIL_TEMPLATES[type]

    const rawCode = Math.floor(10000 + Math.random() * 90000).toString()
    const hashedCode = crypto.createHash('sha256').update(rawCode).digest('hex')

    const expiresAt = new Date(now.getTime() + template.expirationMinutes * 60 * 1000)
    const nextAllowedAt = new Date(now.getTime() + 6 * 60 * 60 * 1000)

    await this.verificationCodeRepository.create(
      email,
      type,
      hashedCode,
      expiresAt,
      nextAllowedAt,
    )

    this.emailService.sendSingleEmail({
      to: email,
      subject: template.subject,
      title: template.title,
      subtitle: `Hola, ${email}`,
      content: `
        <p style="text-align: center; color: #3f3f46;">${template.messageText}</p>
        
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0284c7; background-color: #f0f9ff; padding: 12px 24px; border-radius: 8px; border: 1px dashed #0284c7;">
            ${rawCode}
          </span>
        </div>

        <p style="text-align: center; font-size: 13px; color: #71717a;">
          Este código expira en <strong>${template.expirationMinutes} minutos</strong>.<br>
          Si no solicitaste este código, puedes ignorar este mensaje.
        </p>
      `,
    })
  }
}
