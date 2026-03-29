import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { ReservationDto } from '@/modules/reservation/application/dto/reservation.dto'
import { ReservationPage } from '@/modules/reservation/application/dto/reservation-page.dto'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { ReservationSpecificationBuilder } from './prisma.reservation.specificationBuilder'

@Injectable()
export class PrismaReservationRepositoryAdapter implements ReservationRepositoryPort {
  constructor(private prisma: PrismaClient) {}

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
      .withInclude({ user: true, apartment: true })
      .build()

    const [reservations, reservationsCount] = await this.prisma.$transaction([
      this.prisma.reservation.findMany(query),
      this.prisma.reservation.count({
        where: query.where,
      }),
    ])

    return {
      content: reservations,
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
    return await this.prisma.reservation.create({
      data: {
        type: data.type,
        status: data.status,
        endDate: data.endDate,
        startDate: data.startDate,
        totalPrice: data.totalPrice,
        user: {
          connect: { id: userId },
        },
        apartment: {
          connect: { id: data.apartmentId },
        },
      },
    })
  }

  async findReservationById(id: number): Promise<ReservationModel> {
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    })
    return reservation
  }

  async updateReservation(id: number, newData: Partial<ReservationDto>): Promise<ReservationModel> {
    return await this.prisma.reservation.update({
      where: { id, isDeleted: false },
      data: {
        ...newData,
        startDate: newData.startDate ? new Date(newData.startDate) : undefined,
        endDate: newData.endDate ? new Date(newData.endDate) : undefined,
      },
      include: { apartment: true, user: true },
    })
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

  async updateStatus(id: number, status: any): Promise<ReservationModel> {
    return await this.prisma.reservation.update({
      where: { id, isDeleted: false },
      data: { status },
      include: { apartment: true, user: true },
    })
  }

  async checkAvailability(apartmentId: number, startDate: Date, endDate: Date): Promise<boolean> {
    const overlappingReservations = await this.prisma.reservation.count({
      where: {
        apartmentId,
        isDeleted: false,
        status: { in: ['CONFIRMED', 'PENDING'] },
        OR: [
          {
            // Caso 1: La nueva reserva empieza durante una existente
            startDate: { lte: startDate },
            endDate: { gte: startDate },
          },
          {
            // Caso 2: La nueva reserva termina durante una existente
            startDate: { lte: endDate },
            endDate: { gte: endDate },
          },
          {
            // Caso 3: La nueva reserva envuelve completamente a una existente
            startDate: { gte: startDate },
            endDate: { lte: endDate },
          },
        ],
      },
    })

    return overlappingReservations === 0
  }
}
