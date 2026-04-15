import { User } from '@/interfaces/user.interface'
import { GqlExecutionContext } from '@nestjs/graphql'
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    if (!req.user) {
      throw new UnauthorizedException('Usuario no identificado')
    }
    return req.user
  },
)
