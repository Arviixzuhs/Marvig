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
export class CreateSeasonInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string

  @Field()
  @IsDate()
  startDate: Date

  @Field()
  @IsDate()
  endDate: Date

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  value: number

  @Field(() => AdjustmentUnit)
  @IsEnum(AdjustmentUnit)
  unit: AdjustmentUnit

  @Field(() => PriceModifierType)
  @IsEnum(PriceModifierType)
  action: PriceModifierType

  @Field(() => SeasonType)
  @IsEnum(SeasonType)
  type: SeasonType

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @Field(() => [Int], {
    nullable: true,
    description: 'Opcional. Si se omite, la temporada aplica a todos los apartamentos',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  apartmentIds?: number[]
}
