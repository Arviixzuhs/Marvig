import { SeasonType } from '@/modules/season/domain/enums/season-type.enum'
import { AdjustmentUnit } from '@/modules/season/domain/enums/adjustment-unit.enum'
import { PriceModifierType } from '@/modules/season/domain/enums/price-modifier-type.enum'
import { Field, Float, InputType, Int } from '@nestjs/graphql'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

@InputType()
export class UpdateSeasonInput {
  @Field(() => Int)
  @IsInt()
  id: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  startDate?: Date

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  value?: number

  @Field(() => AdjustmentUnit, { nullable: true })
  @IsOptional()
  @IsEnum(AdjustmentUnit)
  unit?: AdjustmentUnit

  @Field(() => PriceModifierType, { nullable: true })
  @IsOptional()
  @IsEnum(PriceModifierType)
  action?: PriceModifierType

  @Field(() => SeasonType, { nullable: true })
  @IsOptional()
  @IsEnum(SeasonType)
  type?: SeasonType

  @Field({ nullable: true, description: 'Activa o desactiva la temporada' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @Field(() => [Int], {
    nullable: true,
    description:
      'Omitido = no cambia. [] = la temporada pasa a aplicar a todos. [1,2] = reemplaza la lista',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  apartmentIds?: number[]
}
