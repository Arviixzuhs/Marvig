import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { ApartmentImageDto } from '@/modules/apartment/application/dto/apartment-image.dto'
import { ApartmentImageModel } from '@/modules/apartment/domain/models/apartment-image.model'
import { ApartmentImageRepositoryPort } from '@/modules/apartment/domain/repositories/apartment-image.repository.port'

@Injectable()
export class PrismaApartmentImageRepositoryAdapter implements ApartmentImageRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  async createImages(data: ApartmentImageDto): Promise<void> {
    await this.prisma.apartmentImage.createMany({
      data: data.imageUrls.map((url) => ({
        url,
        apartmentId: data.id,
        isPrimary: false,
      })),
    })
  }

  async deleteImagesByApartment(apartmentId: number): Promise<void> {
    await this.prisma.apartmentImage.deleteMany({
      where: {
        apartmentId,
      },
    })
  }

  async setPrimaryImage(imageId: number, apartmentId: number): Promise<ApartmentImageModel> {
    return await this.prisma.$transaction(async (tx) => {
      await tx.apartmentImage.updateMany({
        where: { apartmentId },
        data: { isPrimary: false },
      })

      return await tx.apartmentImage.update({
        where: { id: imageId },
        data: { isPrimary: true },
      })
    })
  }

  async getImagesByApartment(apartmentId: number): Promise<ApartmentImageModel[]> {
    return await this.prisma.apartmentImage.findMany({
      where: { apartmentId },
      orderBy: { id: 'asc' },
    })
  }
}
