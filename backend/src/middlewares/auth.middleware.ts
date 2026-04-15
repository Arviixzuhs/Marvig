import * as jwt from 'jsonwebtoken'
import { User } from '@/interfaces/user.interface'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.cookies?.accessToken

      if (!token) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1]
        }
      }

      if (!token) {
        return res.status(401).json({ message: 'No token provided' })
      }

      jwt.verify(token, process.env.SECRET_KEY as string, (error, decoded) => {
        if (!error) {
          req.user = decoded as User
        }
        next()
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
