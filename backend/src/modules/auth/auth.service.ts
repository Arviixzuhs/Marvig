import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { GoogleAuthDto } from './dto/google-auth.dto'
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

    const token = jwt.sign(
      { userId: user.id, username: user.name, email: user.email },
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

    const user = await this.prisma.user.upsert({
      where: {
        email,
      },
      create: {
        email,
        name: given_name ?? 'Usuario',
        lastName: family_name ?? '',
        avatar: picture ?? '',
      },
      update: {
        ...(picture && { avatar: picture }),
      },
    })

    const accessToken = jwt.sign(
      { userId: user.id, username: user.name, email: user.email },
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
}
