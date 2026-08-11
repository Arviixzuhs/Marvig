import { Field, Float, InputType } from '@nestjs/graphql'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'

@InputType()
export class ApartmentInput {
  @Field(() => Number)
  @IsInt()
  @Min(0)
  floor: number

  @Field()
  @IsString()
  number: string

  @Field(() => ApartmentStatusEnum)
  @IsEnum(ApartmentStatusEnum)
  status: ApartmentStatusEnum

  @Field(() => Number)
  @IsInt()
  bedrooms: number

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  pricePerDay: number

  @Field(() => Number, { nullable: true })
  @IsInt()
  bathrooms?: number

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  squareMeters?: number
}
