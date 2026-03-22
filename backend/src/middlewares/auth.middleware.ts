import { User } from '@/interfaces/user.interface'
import { Buffer } from 'buffer'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies.accessToken

      if (!accessToken) {
        return res.status(401).json({ message: 'No token provided' })
      }

      const secretKey = process.env.SECRET_KEY
      if (!secretKey) {
        return res.status(500).json({ message: 'Missing SECRET_KEY in environment variables' })
      }

      const keyBuffer = Buffer.from(secretKey, 'base64')

      jwt.verify(accessToken, keyBuffer, (error: any, decoded: any) => {
        if (error) {
          console.error('JWT Verification Error:', error)
          return res.status(401).json({ message: 'Invalid token' })
        }

        req.user = decoded as User

        next()
      })
    } catch (error) {
      console.error('AuthMiddleware Error:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
