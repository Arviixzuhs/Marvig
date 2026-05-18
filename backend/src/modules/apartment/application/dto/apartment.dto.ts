import { Field, InputType } from '@nestjs/graphql'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'

@InputType()
export class ApartmentDto {
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

  @Field(() => Number)
  @IsInt()
  pricePerDay: number

  @Field(() => Number, { nullable: true })
  @IsInt()
  bathrooms?: number

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  squareMeters?: number
}
