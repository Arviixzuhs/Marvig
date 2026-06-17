import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { VerificationCodeType } from '@/modules/verificationCode/domain/enums/verificationCode.enum'
import { VerificationCodeModel } from '@/modules/verificationCode/domain/models/verificationCode.model'
import { UpdateVerificationDto } from '@/modules/verificationCode/application/dto/update-verification-code.dto'
import { VerificationCodeMapper } from '@/modules/verificationCode/infrastructure/mapper/verificationCode.mapper'
import { VerificationCodeRepositoryPort } from '@/modules/verificationCode/domain/repositories/verificationCode.repository.port'

@Injectable()
export class PrismaVerificationCodeRepositoryAdapter implements VerificationCodeRepositoryPort {
  constructor(private prisma: PrismaClient) {}
  private readonly verificationCodeMapper = new VerificationCodeMapper()

  async findLastest(email: string, type: VerificationCodeType): Promise<VerificationCodeModel> {
    const latestVerificationCode = await this.prisma.verificationCode.findFirst({
      where: {
        user: {
          email,
        },
        type,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    if (!latestVerificationCode) return null

    return this.verificationCodeMapper.modelToDomain(latestVerificationCode)
  }

  async update(id: number, newData: UpdateVerificationDto): Promise<VerificationCodeModel> {
    const updatedVerificationCode = await this.prisma.verificationCode.update({
      where: {
        id,
      },
      data: {
        ...newData,
      },
    })
    return this.verificationCodeMapper.modelToDomain(updatedVerificationCode)
  }

  async create(
    email: string,
    type: VerificationCodeType,
    code: string,
    expiresAt: Date,
    nextAllowedAt: Date,
  ): Promise<VerificationCodeModel> {
    const createdVerificationCode = await this.prisma.verificationCode.create({
      data: {
        code,
        type,
        expiresAt,
        nextAllowedAt,
        user: {
          connect: {
            email,
          },
        },
      },
    })
    return this.verificationCodeMapper.modelToDomain(createdVerificationCode)
  }
}
