import { Injectable, Inject } from '@nestjs/common'
import { PaymentRepositoryPort } from '@/modules/payment/domain/repositories/payment.repository.port'
import { PaymentReportFilterDto } from '@/modules/report/application/dto/payment-report-filter.dto'
import { PaymentReportModel, PaymentReportPageModel } from '@/modules/report/domain/models/payment-report.model'

@Injectable()
export class PaymentReportUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepositoryPort,
  ) {}

  async execute(filters: PaymentReportFilterDto): Promise<PaymentReportPageModel> {
    const result = await this.paymentRepository.findPayments(filters)

    const content: PaymentReportModel[] = result.content.map((p) => ({
      id: p.id,
      amount: p.amount,
      status: p.status,
      method: p.method,
      date: p.date,
      reference: p.reference,
      description: p.description,
      reservationId: p.reservationId,
      reservation: p.reservation
        ? {
            id: p.reservation.id,
            startDate: p.reservation.startDate,
            endDate: p.reservation.endDate,
            clientName: p.reservation.clientName,
            clientEmail: p.reservation.clientEmail,
            clientPhone: p.reservation.clientPhone,
            apartments: (p.reservation.apartments ?? []).map((a) => ({
              id: a.id,
              number: a.number,
              floor: a.floor,
            })),
          }
        : undefined,
    }))

    return {
      content,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      rowsPerPage: result.rowsPerPage,
    }
  }
}
