import { ReservationDto } from '@/modules/reservation/application/dto/reservation.dto'
import { ReservationPage } from '@/modules/reservation/application/dto/reservation-page.dto'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'

export interface ReservationRepositoryPort {
  existsById(id: number): Promise<boolean>
  updateStatus(id: number, status: ReservationStatus): Promise<ReservationModel>
  findReservations(filters: ReservationFilterDto): Promise<ReservationPage>
  createReservation(reservation: ReservationDto, userId?: number): Promise<ReservationModel>
  updateReservation(id: number, newData: Partial<ReservationDto>): Promise<ReservationModel>
  deleteReservation(id: number): Promise<void>
  checkAvailability(apartmentIds: number[], startDate: Date, endDate: Date): Promise<boolean>
  findReservationById(id: number): Promise<ReservationModel>
}
