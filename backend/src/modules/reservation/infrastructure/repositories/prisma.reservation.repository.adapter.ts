import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { ReservationDto } from '@/modules/reservation/application/dto/reservation.dto'
import { ReservationPage } from '@/modules/reservation/application/dto/reservation-page.dto'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationMapper } from '@/modules/reservation/infrastructure/mappers/reservation.mapper'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { ReservationSpecificationBuilder } from './prisma.reservation.specificationBuilder'

@Injectable()
export class PrismaReservationRepositoryAdapter implements ReservationRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  private readonly reservationMapper = new ReservationMapper()

  async findReservations(filters: ReservationFilterDto): Promise<ReservationPage> {
    const query = new ReservationSpecificationBuilder()
      .withUserId(filters.userId)
      .withApartmentId(filters.apartmentId)
      .withStatus(filters.status)
      .withType(filters.type)
      .withSearch(filters.search)
      .withStayDates(filters.startDate, filters.endDate)
      .withTotalPriceBetween(filters.minPrice, filters.maxPrice)
      .withIsDeleted(false)
      .withOrderBy({ createdAt: 'desc' })
      .withPagination(filters.page, filters.pageSize)
      .withInclude({ user: true, apartments: true })
      .build()

    const [reservations, reservationsCount] = await this.prisma.$transaction([
      this.prisma.reservation.findMany(query),
      this.prisma.reservation.count({
        where: query.where,
      }),
    ])

    return {
      content: this.reservationMapper.modelsToDomain(reservations),
      totalItems: reservationsCount,
      totalPages: Math.ceil(reservationsCount / (query.take || 10)),
      currentPage: filters.page,
      rowsPerPage: query.take,
    }
  }

  async existsById(id: number): Promise<boolean> {
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    })
    return !!reservation
  }

  async createReservation(data: ReservationDto, userId: number): Promise<ReservationModel> {
    const reservation = await this.prisma.reservation.create({
      data: {
        type: data.type,
        status: ReservationStatus.PENDING,
        endDate: data.endDate,
        startDate: data.startDate,
        totalPrice: data.totalPrice,
        user: {
          connect: { id: userId },
        },
        apartments: {
          connect: data.apartmentIds.map((id) => ({ id })),
        },
      },
      include: {
        apartments: {
          include: {
            promotion: true,
          },
        },
        user: true,
      },
    })

    return this.reservationMapper.modelToDomain(reservation)
  }

  async findReservationById(id: number): Promise<ReservationModel> {
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    })

    return this.reservationMapper.modelToDomain(reservation)
  }

  async updateReservation(id: number, newData: Partial<ReservationDto>): Promise<ReservationModel> {
    const updatedReservation = await this.prisma.reservation.update({
      where: { id, isDeleted: false },
      data: {
        ...newData,
        startDate: newData.startDate ? new Date(newData.startDate) : undefined,
        endDate: newData.endDate ? new Date(newData.endDate) : undefined,
      },
      include: { apartments: true, user: true },
    })
    return this.reservationMapper.modelToDomain(updatedReservation)
  }

  async deleteReservation(id: number): Promise<void> {
    await this.prisma.reservation.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })
  }

  async updateStatus(id: number, status: ReservationStatus): Promise<ReservationModel> {
    const updatedReservation = await this.prisma.reservation.update({
      where: { id, isDeleted: false },
      data: { status },
      include: { apartments: true, user: true },
    })

    return this.reservationMapper.modelToDomain(updatedReservation)
  }

  async checkAvailability(
    apartmentIds: number[],
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const overlappingReservations = await this.prisma.reservation.count({
      where: {
        apartments: {
          some: {
            id: { in: apartmentIds },
          },
        },
        isDeleted: false,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [
          {
            OR: [
              {
                // Caso 1: La nueva reserva empieza durante una existente
                startDate: { lte: startDate },
                endDate: { gt: startDate }, // Usamos 'gt' para permitir check-in el mismo día del check-out
              },
              {
                // Caso 2: La nueva reserva termina durante una existente
                startDate: { lt: endDate },
                endDate: { gte: endDate },
              },
              {
                // Caso 3: La nueva reserva envuelve completamente a una existente
                startDate: { gte: startDate },
                endDate: { lte: endDate },
              },
            ],
          },
        ],
      },
    })

    return overlappingReservations === 0
  }
}
