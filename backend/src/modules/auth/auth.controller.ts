import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post('/register')
  register(@Body() data: RegisterDto) {
    return this.appService.userRegister(data)
  }

  @Post('/login')
  login(@Body() data: LoginDto) {
    return this.appService.userLogin(data)
  }
}
