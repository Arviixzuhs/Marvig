import { ReservationDto } from '@/modules/reservation/application/dto/reservation.dto'
import { ReservationPage } from '@/modules/reservation/application/dto/reservation-page.dto'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'

export interface ReservationRepositoryPort {
  updateStatus(id: number, status: string): Promise<ReservationModel>
  findReservations(filters: ReservationFilterDto): Promise<ReservationPage>
  findReservationById(id: number): Promise<ReservationModel>
  existsReservationById(id: number): Promise<boolean>
  createReservation(reservation: ReservationDto, userId: number): Promise<ReservationModel>
  updateReservation(id: number, newData: Partial<ReservationDto>): Promise<ReservationModel>
  deleteReservation(id: number): Promise<void>
  checkAvailability(apartmentId: number, startDate: Date, endDate: Date): Promise<boolean>
}
