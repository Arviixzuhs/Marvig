import { ApiTags } from '@nestjs/swagger'
import { Response, CookieOptions } from 'express'
import { LoginDto } from './dto/login.dto'
import { SigningDto } from './dto/signing.dto'
import { AuthService } from './auth.service'
import { GoogleAuthDto } from './dto/google-auth.dto'
import { ConfirmSigningDto } from './dto/confirm-signin.dto'
import { PasswordResetCodeRequestDto } from './dto/update-password.dto'
import { Body, Controller, Post, Res, HttpCode, HttpStatus, Get, Param } from '@nestjs/common'

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
    await this.authService.signing(data)
    return 'Verificación enviada'
  }

  @Post('/confirm-signing')
  async ConfirmSigning(@Body() data: ConfirmSigningDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.confirmSigning(data)

    res.cookie('accessToken', token, this.getCookieOptions())

    return 'Registro exitoso'
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.authService.userLogin(data)

    res.cookie('accessToken', token, this.getCookieOptions())

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

    res.cookie('accessToken', result.accessToken, this.getCookieOptions())

    return result
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    const cookieOptions = this.getCookieOptions()

    const { maxAge, ...clearOptions } = cookieOptions

    res.clearCookie('accessToken', clearOptions)
    res.clearCookie('isLoggedIn', clearOptions)

    return { message: 'Cierre de sesión exitoso' }
  }

  @Post('/change-password-by-code')
  @HttpCode(HttpStatus.OK)
  async changePasswordByCode(@Body() dto: PasswordResetCodeRequestDto) {
    await this.authService.changePasswordByCode(dto)
    return { message: 'Contraseña actualizada correctamente.' }
  }

  private getCookieOptions(): CookieOptions {
    const isProduction = process.env.NODE_ENV === 'PRODUCTION'

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      domain: isProduction ? process.env.DOMAIN : undefined,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    }
  }
}
