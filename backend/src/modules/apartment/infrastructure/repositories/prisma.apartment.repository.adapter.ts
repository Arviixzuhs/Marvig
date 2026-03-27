import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { ApartmentDto } from '@/modules/apartment/application/dto/apartment.dto'
import { ApartmentPage } from '@/modules/apartment/application/dto/apartment-page.dto'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { UpdateApartmentDto } from '@/modules/apartment/application/dto/update-apartment.dto'
import { ApartmentFilterDto } from '@/modules/apartment/application/dto/apartment-filter.dto'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { ApartmentSpecificationBuilder } from './prisma.apartment.speficicationBuilder'

@Injectable()
export class PrismaApartmentRepositoryAdapter implements ApartmentRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  async createApartment(data: ApartmentDto): Promise<ApartmentModel> {
    return await this.prisma.apartment.create({
      data: {
        ...data,
      },
    })
  }

  async findApartments(filters: ApartmentFilterDto): Promise<ApartmentPage> {
    const query = new ApartmentSpecificationBuilder()
      .withSearch(filters.search)
      .withNumber(filters.number)
      .withFloor(filters.floor)
      .withStatus(filters.status)
      .withRooms(filters.bedrooms, filters.bathrooms)
      .withSquareMetersBetween(filters.minSquareMeters, filters.maxSquareMeters)
      .withIsDeleted(false)
      .withPagination(filters.page, filters.pageSize)
      .withOrderBy({ createdAt: 'desc' })
      .withInclude({ images: true })
      .build()

    const [apartments, totalItems] = await this.prisma.$transaction([
      this.prisma.apartment.findMany(query),
      this.prisma.apartment.count({ where: query.where }),
    ])

    return {
      content: apartments,
      totalItems,
      totalPages: Math.ceil(totalItems / (query.take || 10)),
      currentPage: filters.page,
      rowsPerPage: query.take,
    }
  }

  async findApartment(apartmentId: number): Promise<ApartmentModel | null> {
    return await this.prisma.apartment.findUnique({
      where: {
        id: apartmentId,
        isDeleted: false,
      },
      include: {
        images: true,
      },
    })
  }

  async updateApartment(apartmentId: number, newData: UpdateApartmentDto): Promise<ApartmentModel> {
    return await this.prisma.apartment.update({
      where: { id: apartmentId, isDeleted: false },
      data: {
        ...newData,
      },
      include: {
        images: true,
      },
    })
  }

  async deleteApartment(apartmentId: number): Promise<void> {
    await this.prisma.apartment.update({
      where: { id: apartmentId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })
  }

  async existsByNumber(number: string): Promise<boolean> {
    const apartment = await this.prisma.apartment.findFirst({
      where: {
        number,
      },
    })

    return !!apartment
  }

  async updateStatus(apartmentId: number, status: any): Promise<ApartmentModel> {
    return await this.prisma.apartment.update({
      where: { id: apartmentId },
      data: { status },
      include: {
        images: true,
      },
    })
  }
}
