import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { GoogleAuthDto } from './dto/google-auth.dto'
import { Body, Controller, Post, Res, HttpCode, HttpStatus, Get, Param } from '@nestjs/common'
import { ConfirmSigningDto } from './dto/confirm-signin.dto'
import { SigningDto } from './dto/signing.dto'
import { PasswordResetCodeRequestDto } from './dto/update-password.dto'

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/validate-signing-token/:token')
  async validateSigningToken(@Param('token') token: string) {
    return this.authService.validateToken(token)
  }

  @Post('/signing')
  async Signing(@Body() data: SigningDto): Promise<string> {
    this.authService.signing(data)
    return 'Verificacion enviada'
  }

  @Post('/confirm-signing')
  async ConfirmSigning(@Body() data: ConfirmSigningDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.confirmSigning(data)

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return 'Registro exitoso'
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.authService.userLogin(data)

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return {
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        lastName: user.lastName,
      },
    }
  }

  @Post('/google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() data: GoogleAuthDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.googleAuth(data)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return result
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', { path: '/' })
    res.clearCookie('isLoggedIn', { path: '/' })
    return { message: 'Cierre de sesión exitoso' }
  }

  @Post('/change-password-by-code')
  @HttpCode(HttpStatus.OK)
  async changePasswordByCode(@Body() dto: PasswordResetCodeRequestDto) {
    await this.authService.changePasswordByCode(dto)
    return { message: 'Contraseña actualizada correctamente.' }
  }
}
