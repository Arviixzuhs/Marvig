import { Injectable, Inject } from '@nestjs/common'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { ReservationReportFilterDto } from '@/modules/report/application/dto/reservation-report-filter.dto'
import {
  ReservationReportModel,
  ReservationReportPageModel,
} from '@/modules/report/domain/models/reservation-report.model'

@Injectable()
export class ReservationReportUseCase {
  constructor(
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(filters: ReservationReportFilterDto): Promise<ReservationReportPageModel> {
    const result = await this.reservationRepository.findReservations(filters)

    const content: ReservationReportModel[] = result.content.map((r) => {
      const payments = (r.payments ?? []).map((p) => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        method: p.method,
        date: p.date,
      }))

      const totalPaid = payments
        .filter((p) => p.status === PaymentStatus.CONFIRMED)
        .reduce((sum, p) => sum + p.amount, 0)

      return {
        id: r.id,
        startDate: r.startDate,
        endDate: r.endDate,
        status: r.status,
        type: r.type,
        totalPrice: r.totalPrice,
        totalPaid,
        pendingAmount: r.totalPrice - totalPaid,
        clientName: r.clientName,
        clientEmail: r.clientEmail,
        clientPhone: r.clientPhone,
        userId: r.userId,
        apartments: (r.apartments ?? []).map((a) => ({
          id: a.id,
          number: a.number,
          floor: a.floor,
        })),
        payments,
      }
    })

    return {
      content,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      rowsPerPage: result.rowsPerPage,
    }
  }
}
