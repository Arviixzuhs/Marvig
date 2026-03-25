import { ApartmentDto } from '@/modules/apartament/application/dto/apartament.dto'
import { ApartamentPage } from '@/modules/apartament/application/dto/apartament-page.dto'
import { ApartmentStatus } from 'generated/prisma/enums'
import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'
import { ApartamentFilterDto } from '@/modules/apartament/application/dto/apartament-filter.dto'

export interface ApartamentRepositoryPort {
  updateStatus(apartamentId: number, status: ApartmentStatus): Promise<ApartamentModel>
  findApartament(apartamentId: number): Promise<ApartamentModel | null>
  existsByNumber(number: string): Promise<boolean>
  findApartaments(filters: ApartamentFilterDto): Promise<ApartamentPage>
  createApartament(apartament: ApartmentDto): Promise<ApartamentModel>
  updateApartament(apartamentId: number, newData: Partial<ApartmentDto>): Promise<ApartamentModel>
  deleteApartament(apartamentId: number): Promise<void>
}
