import { ApartmentDto } from '@/modules/apartment/application/dto/apartment.dto'
import { ApartmentPage } from '@/modules/apartment/application/dto/apartment-page.dto'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ApartmentStatus } from 'generated/prisma/enums'
import { UpdateApartmentDto } from '@/modules/apartment/application/dto/update-apartment.dto'
import { ApartmentFilterDto } from '@/modules/apartment/application/dto/apartment-filter.dto'

export interface ApartmentRepositoryPort {
  existsById(id: number): Promise<boolean>
  updateStatus(apartmentId: number, status: ApartmentStatus): Promise<ApartmentModel>
  findApartment(apartmentId: number): Promise<ApartmentModel | null>
  existsByNumber(number: string): Promise<boolean>
  findApartments(filters: ApartmentFilterDto): Promise<ApartmentPage>
  createApartment(apartment: ApartmentDto): Promise<ApartmentModel>
  updateApartment(apartmentId: number, newData: UpdateApartmentDto): Promise<ApartmentModel>
  deleteApartment(apartmentId: number): Promise<void>
}
