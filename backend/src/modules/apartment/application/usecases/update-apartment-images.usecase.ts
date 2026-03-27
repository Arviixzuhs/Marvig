import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ApartmentImageDto } from '@/modules/apartment/application/dto/apartment-image.dto'
import { ApartmentRepositoryPort } from '@/modules/apartment/domain/repositories/apartment.repository.port'
import { ApartmentImageRepositoryPort } from '@/modules/apartment/domain/repositories/apartment-image.repository.port'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UpdateApartmentImagesUseCase {
  constructor(
    @Inject('ApartmentRepository')
    private readonly apartmentRepository: ApartmentRepositoryPort,

    @Inject('ApartmentImageRepository')
    private readonly imageRepository: ApartmentImageRepositoryPort,
  ) {}

  async execute(data: ApartmentImageDto): Promise<ApartmentModel> {
    const apartment = await this.apartmentRepository.findApartment(data.id)
    if (!apartment) throw new NotFoundException('Apartment not found')

    await this.imageRepository.deleteImagesByApartment(data.id)

    await this.imageRepository.createImages(data)

    const updatedApartment = await this.apartmentRepository.findApartment(data.id)
    return updatedApartment!
  }
}
