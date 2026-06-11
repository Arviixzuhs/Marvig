import { ObjectType, Field, Int, Float } from '@nestjs/graphql'

@ObjectType()
export class ApartmentOccupancyType {
  @Field(() => Int)
  apartmentId: number

  @Field()
  apartmentNumber: string

  @Field(() => Int)
  floor: number

  @Field(() => Int)
  totalNights: number

  @Field(() => Int)
  occupiedNights: number

  @Field(() => Int)
  blockedNights: number

  @Field(() => Int)
  availableNights: number

  @Field(() => Float)
  occupancyPercentage: number

  @Field(() => Float)
  generatedIncome: number
}

@ObjectType()
export class OccupancyReportType {
  @Field(() => Date)
  fromDate: Date

  @Field(() => Date)
  toDate: Date

  @Field(() => [ApartmentOccupancyType])
  apartments: ApartmentOccupancyType[]
}
