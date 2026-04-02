import { PromotionTypeEnum } from '@/modules/promotion/domain/enums/promotion-type.enum'
import { InputType, Field, Float } from '@nestjs/graphql'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

@InputType()
export class PromotionDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la promoción es obligatorio' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  name: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'La descripción no puede exceder los 200 caracteres' })
  description?: string

  @Field(() => PromotionTypeEnum)
  @IsEnum(PromotionTypeEnum, { message: 'El tipo de promoción no es válido' })
  @IsNotEmpty({ message: 'El tipo de promoción es obligatorio' })
  type: PromotionTypeEnum

  @Field(() => Float)
  @IsNumber({}, { message: 'El valor debe ser un número' })
  @Min(0, { message: 'El valor no puede ser negativo' })
  @IsNotEmpty({ message: 'El valor de la promoción es obligatorio' })
  value: number
}
