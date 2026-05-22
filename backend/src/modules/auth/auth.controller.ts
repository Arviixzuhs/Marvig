import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { GoogleAuthDto } from './dto/google-auth.dto'
import { Body, Controller, Post, Res, HttpCode, HttpStatus } from '@nestjs/common'

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post('/register')
  async register(@Body() data: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.appService.userRegister(data)

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
    const { token, user } = await this.appService.userLogin(data)

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
    const result = await this.appService.googleAuth(data)

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
}
