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
      status: model.status as ApartmentStatusEnum,
      bedrooms: model.bedrooms,
      bathrooms: model.bathrooms,
      updatedAt: model.updatedAt,
      pricePerDay: Number(model.pricePerDay),
      promotionId: model.promotionId,
      squareMeters: model.squareMeters,
      createdAt: model.createdAt,
      images: model.images ? this.imageMapper.modelsToDomain(model.images) : [],
    }
  }
}
