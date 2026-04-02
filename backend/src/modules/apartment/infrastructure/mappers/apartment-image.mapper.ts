import { BaseMapper } from '@/common/mappers/base.mapper'
import { ApartmentImageModel } from '@/modules/apartment/domain/models/apartment-image.model'
import { ApartmentImage as PrismaApartmentImage } from 'generated/prisma/client'

export class ApartmentImageMapper extends BaseMapper<PrismaApartmentImage, ApartmentImageModel> {
  modelToDomain(model: PrismaApartmentImage): ApartmentImageModel {
    return {
      id: model.id,
      url: model.url,
      isPrimary: model.isPrimary,
      apartmentId: model.apartmentId,
    }
  }
}
