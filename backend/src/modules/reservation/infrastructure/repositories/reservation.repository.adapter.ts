import { Injectable } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma/client'
import { ReservationDto } from '@/modules/reservation/application/dto/reservation.dto'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'

@Injectable()
export class PrismaReservationRepositoryAdapter implements ReservationRepositoryPort {
  constructor(private prisma: PrismaClient) { }

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
        apartament: {
          connect: { id: data.apartamentId },
        },
      },
    })
  }

  async existsReservationById(id: number): Promise<boolean> {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id, isDeleted: false },
    })
    return !!reservation
  }

  async findReservationById(id: number): Promise<ReservationModel> {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id, isDeleted: false },
    })
    return reservation
  }

  async findReservations(): Promise<ReservationModel[]> {
    return await this.prisma.reservation.findMany({
      where: { isDeleted: false },
      include: { apartament: true, user: true },
    })
  }

  async updateReservation(id: number, newData: Partial<ReservationDto>): Promise<ReservationModel> {
    return await this.prisma.reservation.update({
      where: { id, isDeleted: false },
      data: {
        ...newData,
        startDate: newData.startDate ? new Date(newData.startDate) : undefined,
        endDate: newData.endDate ? new Date(newData.endDate) : undefined,
      },
      include: { apartament: true, user: true },
    })
  }

  async deleteReservation(id: number): Promise<void> {
    await this.prisma.reservation.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    })
  }

  async updateStatus(id: number, status: any): Promise<ReservationModel> {
    return await this.prisma.reservation.update({
      where: { id, isDeleted: false },
      data: { status },
      include: { apartament: true, user: true },
    })
  }

  async checkAvailability(apartamentId: number, startDate: Date, endDate: Date): Promise<boolean> {
    const overlappingReservations = await this.prisma.reservation.count({
      where: {
        apartamentId,
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
