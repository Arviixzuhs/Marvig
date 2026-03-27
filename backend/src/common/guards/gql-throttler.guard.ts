import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    const http = context.switchToHttp()
    const req = http.getRequest()
    const res = http.getResponse()

    // 1. Si req existe, es una petición REST (como tu subida de archivos)
    if (req) {
      return { req, res }
    }

    // 2. Si no, intentamos extraerlo del contexto de GraphQL
    const gqlCtx = GqlExecutionContext.create(context)
    const ctx = gqlCtx.getContext()

    // Importante: Aquí sacamos req y res que inyectaste en el GraphQLModule
    if (ctx && ctx.req) {
      return { req: ctx.req, res: ctx.res }
    }

    // Si llegamos aquí, algo está muy mal con el contexto
    throw new Error('ThrottlerGuard: No se pudo encontrar el objeto Request/Response')
  }
}
