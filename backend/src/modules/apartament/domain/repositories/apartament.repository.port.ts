import { ApartmentDto } from '@/modules/apartament/application/dto/apartament.dto'
import { ApartmentStatus } from 'generated/prisma/enums'
import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'

export interface ApartamentRepositoryPort {
  updateStatus(apartamentId: number, status: ApartmentStatus): Promise<ApartamentModel>
  findAvailable(startDate: Date, endDate: Date): Promise<ApartamentModel[]>
  findApartament(apartamentId: number): Promise<ApartamentModel | null>
  existsByNumber(number: string): Promise<boolean>
  findApartaments(): Promise<ApartamentModel[]>
  createApartament(apartament: ApartmentDto): Promise<ApartamentModel>
  updateApartament(apartamentId: number, newData: Partial<ApartmentDto>): Promise<ApartamentModel>
  deleteApartament(apartamentId: number): Promise<void>
}
