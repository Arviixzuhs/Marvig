import { User } from '@/interfaces/user.interface'
import { GqlExecutionContext } from '@nestjs/graphql'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    return req.user
  },
)
