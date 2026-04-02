import { BaseMapper } from '@/common/mappers/base.mapper'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { ApartmentImageMapper } from './apartment-image.mapper'
import {
  Apartment as PrismaApartment,
  ApartmentImage as PrismaApartmentImage,
} from 'generated/prisma/client'

type PrismaApartmentWithRelations = PrismaApartment & {
  images?: PrismaApartmentImage[]
}

export class ApartmentMapper extends BaseMapper<PrismaApartmentWithRelations, ApartmentModel> {
  private readonly imageMapper = new ApartmentImageMapper()

  modelToDomain(model: PrismaApartmentWithRelations): ApartmentModel {
    return {
      id: model.id,
      floor: model.floor,
      number: model.number,
      bedrooms: model.bedrooms,
      bathrooms: model.bathrooms,
      squareMeters: model.squareMeters,
      status: model.status as ApartmentStatusEnum,
      pricePerDay: Number(model.pricePerDay),
      promotionId: model.promotionId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      images: model.images ? this.imageMapper.modelsToDomain(model.images) : [],
    }
  }
}
