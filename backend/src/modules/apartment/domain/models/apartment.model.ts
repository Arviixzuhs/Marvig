import { ApartmentStatus } from 'generated/prisma/enums'
import { ApartmentImageModel } from './apartment-image.model'

export class ApartmentModel {
  id: number
  floor: number
  number: string
  images?: ApartmentImageModel[] | null
  status: ApartmentStatus
  bedrooms: number
  bathrooms: number
  createdAt?: Date | null
  squareMeters?: number | null
  updatedAt?: Date | null
}
