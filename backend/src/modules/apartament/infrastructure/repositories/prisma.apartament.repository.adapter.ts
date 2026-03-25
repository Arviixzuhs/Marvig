import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { ApartmentDto } from '@/modules/apartament/application/dto/apartament.dto'
import { ApartamentPage } from '@/modules/apartament/application/dto/apartament-page.dto'
import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'
import { ApartamentFilterDto } from '@/modules/apartament/application/dto/apartament-filter.dto'
import { ApartamentRepositoryPort } from '@/modules/apartament/domain/repositories/apartament.repository.port'
import { ApartamentSpecificationBuilder } from './prisma.apartament.speficicationBuilder'

@Injectable()
export class PrismaApartamentRepositoryAdapter implements ApartamentRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  async createApartament(data: ApartmentDto): Promise<ApartamentModel> {
    return await this.prisma.apartament.create({
      data: {
        ...data,
      },
    })
  }

  async findApartaments(filters: ApartamentFilterDto): Promise<ApartamentPage> {
    const query = new ApartamentSpecificationBuilder()
      .withSearch(filters.search)
      .withNumber(filters.number)
      .withFloor(filters.floor)
      .withStatus(filters.status)
      .withRooms(filters.bedrooms, filters.bathrooms)
      .withSquareMetersBetween(filters.minSquareMeters, filters.maxSquareMeters)
      .withIsDeleted(false)
      .withPagination(filters.page, filters.pageSize)
      .withOrderBy({ number: 'asc' })
      .withInclude({ images: true })
      .build()

    const [apartaments, totalItems] = await this.prisma.$transaction([
      this.prisma.apartament.findMany(query),
      this.prisma.apartament.count({ where: query.where }),
    ])

    return {
      content: apartaments,
      totalItems,
      totalPages: Math.ceil(totalItems / (query.take || 10)),
      currentPage: filters.page,
      rowsPerPage: query.take,
    }
  }

  async findApartament(apartamentId: number): Promise<ApartamentModel | null> {
    return await this.prisma.apartament.findUnique({
      where: {
        id: apartamentId,
        isDeleted: false,
      },
      include: {
        images: true,
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
        images: true,
      },
    })
  }

  async deleteApartament(apartamentId: number): Promise<void> {
    await this.prisma.apartament.update({
      where: { id: apartamentId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
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
        images: true,
      },
    })
  }
}
