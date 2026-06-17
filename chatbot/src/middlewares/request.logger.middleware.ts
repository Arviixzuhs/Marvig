import { Logger } from '@nestjs/common'
import { ServerMode } from '@/types/server.mode'
import { requestStatusColor } from '@/utils/request.status.color'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.SERVER_MODE === ServerMode.DEV) {
      const { method, originalUrl } = req
      const start = Date.now()

      res.on('finish', () => {
        const duration = Date.now() - start
        const statusCode = res.statusCode
        const color = requestStatusColor(statusCode)
        Logger.log(
          `${color}${duration}ms | ${method} ${originalUrl} | Status: ${statusCode}\x1b[0m`,
        )
      })
    }
    next()
  }
}
