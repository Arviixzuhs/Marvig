import { Injectable, Inject } from '@nestjs/common'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { PaymentStatus } from '@/modules/payment/domain/enums/payment-status.enum'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { ReservationRepositoryPort } from '@/modules/reservation/domain/repositories/reservation.repository.port'
import { OccupancyReportFilterDto } from '@/modules/report/application/dto/occupancy-report-filter.dto'
import { ApartmentOccupancyModel, OccupancyReportModel } from '@/modules/report/domain/models/occupancy-report.model'

@Injectable()
export class OccupancyReportUseCase {
  constructor(
    @Inject('ApartmentRepository')
    private readonly apartmentRepository: ApartmentRepositoryPort,
    @Inject('ReservationRepository')
    private readonly reservationRepository: ReservationRepositoryPort,
  ) {}

  async execute(filters: OccupancyReportFilterDto): Promise<OccupancyReportModel> {
    const fromDate = new Date(filters.fromDate)
    const toDate = new Date(filters.toDate)
    const fromTs = fromDate.getTime()
    const toTs = toDate.getTime()
    const totalNights = Math.round((toTs - fromTs) / 86400000)

    // Get all apartments (optionally filtered by IDs)
    const apartmentsPage = await this.apartmentRepository.findApartments({
      page: 0,
      pageSize: 99999,
      ids: filters.apartmentIds,
    })

    const apartments: ApartmentOccupancyModel[] = []

    for (const apt of apartmentsPage.content) {
      const reservations = await this.reservationRepository.findByApartmentId(apt.id)

      let occupiedNights = 0
      let blockedNights = 0
      let generatedIncome = 0

      for (const r of reservations) {
        const rStart = new Date(r.startDate).getTime()
        const rEnd = new Date(r.endDate).getTime()

        const overlapStart = Math.max(fromTs, rStart)
        const overlapEnd = Math.min(toTs, rEnd)
        const nights = Math.max(0, Math.round((overlapEnd - overlapStart) / 86400000))

        if (r.status === ReservationStatus.CONFIRMED) {
          occupiedNights += nights
          // Sum confirmed payments in range
          const confirmedPayments = (r.payments ?? []).filter(
            (p) =>
              p.status === PaymentStatus.CONFIRMED &&
              p.date &&
              new Date(p.date).getTime() >= fromTs &&
              new Date(p.date).getTime() <= toTs,
          )
          generatedIncome += confirmedPayments.reduce((sum, p) => sum + p.amount, 0)
        } else if (r.status === ReservationStatus.PENDING) {
          blockedNights += nights
        }
      }

      const availableNights = Math.max(0, totalNights - occupiedNights - blockedNights)
      const occupancyPercentage = totalNights > 0 ? (occupiedNights / totalNights) * 100 : 0

      apartments.push({
        apartmentId: apt.id,
        apartmentNumber: apt.number,
        floor: apt.floor,
        totalNights,
        occupiedNights,
        blockedNights,
        availableNights,
        occupancyPercentage: Math.round(occupancyPercentage * 100) / 100,
        generatedIncome,
      })
    }

    return {
      fromDate,
      toDate,
      apartments,
    }
  }
}
