import { Field, InputType } from '@nestjs/graphql'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'

@InputType()
export class ApartmentDto {
  @Field(() => Number)
  @IsInt({ message: 'El piso debe ser un número entero' })
  @Min(0)
  floor: number

  @Field()
  @IsString()
  number: string

  @Field(() => ApartmentStatusEnum, { defaultValue: ApartmentStatusEnum.AVAILABLE })
  @IsEnum(ApartmentStatusEnum, { message: 'El estado no es válido' })
  status: ApartmentStatusEnum

  @Field(() => Number, { defaultValue: 1 })
  @IsInt()
  bedrooms: number

  @Field(() => Number, { defaultValue: 1 })
  @IsInt()
  pricePerDay: number

  @Field(() => Number, { defaultValue: 1 })
  @IsInt()
  bathrooms?: number

  @Field(() => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  squareMeters?: number
}
