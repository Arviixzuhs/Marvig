import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { SeasonMapper } from '@/modules/season/infrastructure/mapper/season.mapper'
import { SeasonFilterDto } from '@/modules/season/application/dto/season-filter.dto'
import { CreateSeasonDto } from '@/modules/season/application/dto/create-season.dto'
import { UpdateSeasonDto } from '@/modules/season/application/dto/update-season.dto'
import { SeasonRepositoryPort } from '@/modules/season/domain/repositories/season.repository.port'
import { SeasonSpecificationBuilder } from '@/modules/season/infrastructure/repositories/prisma.season.specificationBuilder'
import { FindOverlappingSeasonsParams } from '@/modules/season/application/dto/find-overlapping-seasons-params.dto'

const includeApartmentIds = { apartments: { select: { id: true } } } as const

@Injectable()
export class PrismaSeasonRepositoryAdapter implements SeasonRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  private readonly seasonMapper = new SeasonMapper()

  async findSeasons(filters: SeasonFilterDto) {
    const query = new SeasonSpecificationBuilder()
      .withName(filters.name)
      .withTypes(filters.types)
      .withUnits(filters.units)
      .withActions(filters.actions)
      .withIsActive(filters.isActive)
      .withApartmentId(filters.apartmentId)
      .withDateOverlap(filters.fromDate, filters.toDate)
      .withPagination(filters.page, filters.pageSize, filters.isUnpaged)
      .withOrderBy({ startDate: 'desc' })
      .build()

    const [seasons, seasonsCount] = await this.prisma.$transaction([
      this.prisma.season.findMany({ ...query, include: includeApartmentIds }),
      this.prisma.season.count({
        where: query.where,
      }),
    ])

    return {
      content: this.seasonMapper.modelsToDomain(seasons),
      totalPages: query.take ? Math.ceil(seasonsCount / query.take) : 1,
      totalItems: seasonsCount,
      currentPage: filters.page ?? 1,
      rowsPerPage: query.take ?? seasonsCount,
    }
  }

  async findSeasonById(id: number) {
    const season = await this.prisma.season.findFirst({
      where: { id, isDeleted: false },
      include: includeApartmentIds,
    })

    return season ? this.seasonMapper.modelToDomain(season) : null
  }

  async createSeason(data: CreateSeasonDto) {
    const createdSeason = await this.prisma.season.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        value: data.value,
        unit: data.unit,
        action: data.action,
        type: data.type,
        isActive: data.isActive,
        ...(data.apartmentIds?.length && {
          apartments: { connect: data.apartmentIds.map((id) => ({ id })) },
        }),
      },
      include: includeApartmentIds,
    })

    return this.seasonMapper.modelToDomain(createdSeason)
  }

  async updateSeason(id: number, data: Omit<UpdateSeasonDto, 'id'>) {
    const updatedSeason = await this.prisma.season.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        value: data.value,
        unit: data.unit,
        action: data.action,
        type: data.type,
        isActive: data.isActive,
        ...(data.apartmentIds && {
          apartments: { set: data.apartmentIds.map((apartmentId) => ({ id: apartmentId })) },
        }),
      },
      include: includeApartmentIds,
    })

    return this.seasonMapper.modelToDomain(updatedSeason)
  }

  async softDeleteSeason(id: number): Promise<void> {
    await this.prisma.season.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
        deletedAt: new Date(),
      },
    })
  }

  async findOverlappingSeasons({
    startDate,
    endDate,
    apartmentIds,
    excludeId,
  }: FindOverlappingSeasonsParams) {
    const seasons = await this.prisma.season.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        ...(excludeId && { id: { not: excludeId } }),
        // Rangos [start, end] se solapan si: existente.start <= nuevo.end Y existente.end >= nuevo.start
        startDate: { lte: endDate },
        endDate: { gte: startDate },
        // Si la nueva es global, choca con cualquiera. Si tiene apartamentos,
        // choca con las globales y con las que compartan al menos un apartamento.
        ...(apartmentIds.length && {
          OR: [
            { apartments: { none: {} } },
            { apartments: { some: { id: { in: apartmentIds } } } },
          ],
        }),
      },
      include: includeApartmentIds,
    })

    return this.seasonMapper.modelsToDomain(seasons)
  }

  async findMissingApartmentIds(apartmentIds: number[]): Promise<number[]> {
    const found = await this.prisma.apartment.findMany({
      where: { id: { in: apartmentIds } },
      select: { id: true },
    })

    const foundIds = new Set(found.map((apartment) => apartment.id))
    return apartmentIds.filter((id) => !foundIds.has(id))
  }
}
