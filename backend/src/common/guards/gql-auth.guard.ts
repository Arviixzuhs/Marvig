import { User } from '@/interfaces/user.interface'
import * as jwt from 'jsonwebtoken'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'
import { GqlExecutionContext } from '@nestjs/graphql'
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common'

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<string>() !== 'graphql') {
      return true
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()

    try {
      let token = req.cookies?.accessToken

      if (!token) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1]
        }
      }

      if (!token) {
        throw new UnauthorizedException('No token provided')
      }

      const decoded = await new Promise<User>((resolve, reject) => {
        jwt.verify(token, process.env.SECRET_KEY as string, (error, decodedToken) => {
          if (error) {
            return reject(new UnauthorizedException('Invalid or expired token'))
          }
          resolve(decodedToken as User)
        })
      })

      req.user = decoded
      return true
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }

      throw new InternalServerErrorException('Internal server error')
    }
  }
}
