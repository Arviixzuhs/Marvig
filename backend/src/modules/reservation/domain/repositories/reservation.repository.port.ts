import { ReservationDto } from '@/modules/reservation/application/dto/reservation.dto'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'
import { ReservationStatus } from '@/modules/reservation/domain/enums/reservation-status.enum'
import { ReservationPageDto } from '@/modules/reservation/application/dto/reservation-page.dto'
import { ReservationFilterDto } from '@/modules/reservation/application/dto/reservation-filter.dto'

export interface ReservationRepositoryPort {
  existsById(id: number): Promise<boolean>
  updateStatus(id: number, status: ReservationStatus): Promise<ReservationModel>
  findReservations(filters: ReservationFilterDto): Promise<ReservationPageDto>
  findByApartmentId(apartmentId: number): Promise<ReservationModel[]>
  createReservation(reservation: ReservationDto, userId?: number): Promise<ReservationModel>
  updateReservation(id: number, newData: Partial<ReservationDto>): Promise<ReservationModel>
  deleteReservation(id: number): Promise<void>
  checkAvailability(apartmentIds: number[], startDate: Date, endDate: Date): Promise<boolean>
  findReservationById(id: number): Promise<ReservationModel | null>
  findAvailableReservations(apartmentIds: number[], reserveIdToExclude?: number): Promise<ReservationModel[]>
}
