import { Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
      .then(() => {
        Logger.log('Successfully connected to MongoDB', 'PrismaClient')
      })
      .catch(() => {
        Logger.log('Error connecting to MongoDB', 'PrismaClient')
      })
  }
}
