import { ReservationDto } from '@/modules/reservation/application/dto/reservation.dto'
import { ReservationModel } from '@/modules/reservation/domain/models/reservation.model'

export interface ReservationRepositoryPort {
  updateStatus(id: number, status: string): Promise<ReservationModel>
  findReservations(): Promise<ReservationModel[]>
  findReservationById(id: number): Promise<ReservationModel>
  existsReservationById(id: number): Promise<boolean>
  createReservation(reservation: ReservationDto, userId: number): Promise<ReservationModel>
  updateReservation(id: number, newData: Partial<ReservationDto>): Promise<ReservationModel>
  deleteReservation(id: number): Promise<void>
  checkAvailability(apartamentId: number, startDate: Date, endDate: Date): Promise<boolean>
}
