import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { SigningDto } from './dto/signing.dto'
import { OAuth2Client } from 'google-auth-library'
import { EmailService } from '@/common/utils/mail-sender.util'
import { GoogleAuthDto } from './dto/google-auth.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { ConfirmSigningDto } from './dto/confirm-signin.dto'
import { PasswordResetCodeRequestDto } from './dto/update-password.dto'
import { ValidateVarificationCodeUseCase } from '../verificationCode/application/usecases/validate-verification-code.usecase'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { VerificationCodeType } from '../verificationCode/domain/enums/verificationCode.enum'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly validateVarificationCodeUseCase: ValidateVarificationCodeUseCase,
    private readonly emailService: EmailService) { }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async signing(data: SigningDto): Promise<void> {
    const user = await this.findUserByEmail(data.email);
    if (user) {
      throw new HttpException('Ese correo ya está registrado.', HttpStatus.CONFLICT);
    }

    const token = jwt.sign(
      {
        name: data.name,
        email: data.email,
        lastName: data.lastName,
      },
      process.env.SECRET_KEY,
      { expiresIn: '30m' }
    );

    const confirmationLink = `${process.env.CLIENT_ORIGIN}/register/create-password/${token}`;

    this.emailService.sendSingleEmail({
      to: data.email,
      subject: 'Confirmación de Registro - Posada Marvig',
      title: 'Confirma tu identidad',
      subtitle: `Hola, ${data.name?.trim() || 'Cliente'}`,
      content: `
      <p>A continuación, encontrarás el enlace para finalizar tu registro:</p>
      
      <div class="cta-container" style="text-align: center; margin: 20px 0;">
        <a href="${confirmationLink}" class="btn-primary" style="display: inline-block; padding: 10px 20px; text-decoration: none;">
          Confirmar registro
        </a>
      </div>

      <p style="text-align: center; font-size: 13px; color: #71717a;">
        Este enlace expira en 30 minutos.<br>
        ¡Gracias por confiar en nosotros!
      </p>
    `,
    });
  }

  validateToken<T = any>(token: string): T {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error('SECRET_KEY no está configurada en las variables de entorno.');
    }

    try {
      return jwt.verify(token, secretKey) as T;
    } catch (error) {
      throw new HttpException('El token es inválido o ha expirado.', HttpStatus.UNAUTHORIZED);
    }
  }

  async confirmSigning(data: ConfirmSigningDto) {
    if (data.password !== data.repeatPassword) {
      throw new HttpException('Las contraseñas deben ser iguales.', HttpStatus.BAD_REQUEST);
    }

    let tokenData = this.validateToken<SigningDto>(data.token)

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const createdUser = await this.prisma.user.create({
      data: {
        name: tokenData.name,
        email: tokenData.email,
        lastName: tokenData.lastName,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      {
        userId: createdUser.id,
        username: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    return token
  }

  async userLogin(data: LoginDto) {
    const user = await this.findUserByEmail(data.email)
    if (!user) throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND)

    if (!user.password)
      throw new HttpException(
        'Este usuario no tiene contraseña. Inicia sesión con Google.',
        HttpStatus.UNAUTHORIZED,
      )

    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid)
      throw new HttpException('Email o contraseña no válidos.', HttpStatus.UNAUTHORIZED)

    const token = jwt.sign(
      { userId: user.id, username: user.name, email: user.email, role: user.role },
      process.env.SECRET_KEY,
    )

    return { token, user }
  }

  async googleAuth(dto: GoogleAuthDto) {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const client = new OAuth2Client(clientId)

    let email: string | undefined
    let given_name: string | undefined
    let family_name: string | undefined
    let picture: string | undefined

    try {
      const ticket = await client.verifyIdToken({
        idToken: dto.credential,
        audience: clientId,
      })
      const payload = ticket.getPayload()

      if (!payload) {
        throw new Error('Payload vacío')
      }

      email = payload.email
      given_name = payload.given_name
      family_name = payload.family_name
      picture = payload.picture
    } catch {
      throw new HttpException('Token de Google inválido o expirado.', HttpStatus.UNAUTHORIZED)
    }

    if (!email) {
      throw new HttpException(
        'La cuenta de Google no tiene un correo electrónico.',
        HttpStatus.BAD_REQUEST,
      )
    }

    let user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: given_name ?? 'Usuario',
          lastName: family_name ?? '',
          avatar: picture ?? '',
        },
      })
    }

    const accessToken = jwt.sign(
      { userId: user.id, username: user.name, email: user.email, role: user.role },
      process.env.SECRET_KEY,
    )

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      },
    }
  }

  async changePasswordByCode(data: PasswordResetCodeRequestDto) {
    const user = await this.findUserByEmail(data.email)
    if (!user) {
      throw new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND);
    }

    if (data.newPassword !== data.repeatNewPassword) {
      throw new HttpException('Las contraseñas deben ser iguales.', HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid = await bcrypt.compare(data.newPassword, user.password)
    if (isPasswordValid) {
      throw new HttpException('La nueva contraseña no puede ser igual a la actual.', HttpStatus.UNAUTHORIZED)
    }

    await this.validateVarificationCodeUseCase.execute(data.code, VerificationCodeType.PASSWORD_RESET, data.email, true)

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword
      }
    })
  }
}
