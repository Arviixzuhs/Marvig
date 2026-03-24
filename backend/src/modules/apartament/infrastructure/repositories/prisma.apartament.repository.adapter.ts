import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { ApartmentDto } from '@/modules/apartament/application/dto/apartament.dto'
import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'
import { ApartamentRepositoryPort } from '@/modules/apartament/domain/repositories/apartament.repository.port'

@Injectable()
export class PrismaApartamentRepositoryAdapter implements ApartamentRepositoryPort {
  constructor(private prisma: PrismaClient) { }

  async createApartament(data: ApartmentDto): Promise<ApartamentModel> {
    return await this.prisma.apartament.create({
      data: {
        ...data,
      },
    })
  }

  async findApartaments(): Promise<ApartamentModel[]> {
    return await this.prisma.apartament.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        images: true
      },
    })
  }

  async findApartament(apartamentId: number): Promise<ApartamentModel | null> {
    return await this.prisma.apartament.findUnique({
      where: {
        id: apartamentId,
        isDeleted: false
      },
      include: {
        images: true
      },
    })
  }

  async updateApartament(
    apartamentId: number,
    newData: Partial<ApartmentDto>,
  ): Promise<ApartamentModel> {
    return await this.prisma.apartament.update({
      where: { id: apartamentId, isDeleted: false },
      data: {
        ...newData,
      },
      include: {
        images: true
      },
    })
  }

  async deleteApartament(apartamentId: number): Promise<void> {
    await this.prisma.apartament.update({
      where: { id: apartamentId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      }
    })
  }

  async findAvailable(startDate: Date, endDate: Date): Promise<ApartamentModel[]> {
    return await this.prisma.apartament.findMany({
      where: {
        status: 'AVAILABLE',
        isDeleted: false,
        reservations: {
          none: {
            OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
          },
        },
      },
      include: {
        images: true
      },
    })
  }

  async existsByNumber(number: string): Promise<boolean> {
    const apartament = await this.prisma.apartament.findUnique({
      where: {
        number,
      },
    })

    return !!apartament
  }

  async updateStatus(apartamentId: number, status: any): Promise<ApartamentModel> {
    return await this.prisma.apartament.update({
      where: { id: apartamentId },
      data: { status },
      include: {
        images: true
      },
    })
  }
}
