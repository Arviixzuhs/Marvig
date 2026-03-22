import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async userRegister(data: RegisterDto) {
    const user = await this.findUserByEmail(data.email)
    if (user) throw new HttpException('Ese correo ya está registrado', HttpStatus.CONFLICT)

    if (data.password !== data.repeatPassword) {
      throw new HttpException('Las contraseñas deben ser iguales', HttpStatus.CONFLICT)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    data.password = hashedPassword

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        lastName: data.lastName,
        password: data.password,
      },
    })
  }

  async userLogin(data: LoginDto) {
    const user = await this.findUserByEmail(data.email)
    if (!user) throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)

    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid) throw new HttpException('Contraseña incorrecta', HttpStatus.UNAUTHORIZED)

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY)

    return token
  }
}
