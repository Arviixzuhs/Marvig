import { ApartmentImageDto } from '@/modules/apartment/application/dto/apartment-image.dto'
import { ApartmentImageModel } from '@/modules/apartment/domain/models/apartment-image.model'

export interface ApartmentImageRepositoryPort {
  createImages(data: ApartmentImageDto): Promise<void>
  setPrimaryImage(imageId: number, apartmentId: number): Promise<ApartmentImageModel>
  getImagesByApartment(apartmentId: number): Promise<ApartmentImageModel[]>
  deleteImagesByApartment(apartmentId: number): Promise<void>
}
