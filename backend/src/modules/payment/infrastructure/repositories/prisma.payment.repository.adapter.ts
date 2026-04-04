import { Injectable } from '@nestjs/common'
import { PaymentPage } from '@/modules/payment/application/dto/payment-page.dto'
import { PaymentModel } from '@/modules/payment/domain/models/payment.model'
import { PrismaClient } from 'generated/prisma/client'
import { PaymentMapper } from '@/modules/payment/infrastructure/mappers/payment.mapper'
import { PaymentFilterDto } from '@/modules/payment/application/dto/payment-filter.dto'
import { CreatePaymentDto } from '@/modules/payment/application/dto/create-payment.dto'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'
import { PaymentSpecificationBuilder } from './prisma.payment.specificationBuilder'

@Injectable()
export class PrismaPaymentRepositoryAdapter implements PaymentRepositoryPort {
  constructor(private prisma: PrismaClient) {}

  private readonly paymentMapper = new PaymentMapper()

  async createPayment(data: CreatePaymentDto): Promise<PaymentModel> {
    const createdPayment = await this.prisma.payment.create({
      data: {
        date: data.date,
        method: data.method,
        reference: data.reference,
        status: data.status,
        amount: data.amount,
        description: data.description,
        reservationId: data.reservationId,
      },
    })

    return this.paymentMapper.modelToDomain(createdPayment)
  }

  async findPayments(filters: PaymentFilterDto): Promise<PaymentPage> {
    const builder = new PaymentSpecificationBuilder()
      .withSearch(filters.search)
      .withReservationId(filters.reservationId)
      .withCreatedAtBetween(filters.fromDate, filters.toDate)
      .withPagination(filters.page, filters.pageSize)
      .withOrderBy({ createdAt: 'desc' })
      .build()

    const [payments, totalItems] = await this.prisma.$transaction([
      this.prisma.payment.findMany(builder),
      this.prisma.payment.count({ where: builder.where }),
    ])

    const rowsPerPage = builder.take || 10

    return {
      content: this.paymentMapper.modelsToDomain(payments),
      totalItems,
      totalPages: Math.ceil(totalItems / rowsPerPage),
      currentPage: filters.page,
      rowsPerPage: rowsPerPage,
    }
  }

  async existsById(id: number): Promise<boolean> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      select: { id: true },
    })
    return !!payment
  }

  async findPayment(paymentId: number): Promise<PaymentModel | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    })

    return this.paymentMapper.modelToDomain(payment)
  }
}
