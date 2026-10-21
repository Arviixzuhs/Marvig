import { SeasonType } from '@/modules/season/domain/enums/season-type.enum'
import { AdjustmentUnit } from '@/modules/season/domain/enums/adjustment-unit.enum'
import { DateFilterInput } from '@/common/graphql/inputs/date-filter.input'
import { PriceModifierType } from '@/modules/season/domain/enums/price-modifier-type.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { Field, InputType, Int, IntersectionType } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class SeasonFilterInput extends IntersectionType(PaginationFilterInput, DateFilterInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => [SeasonType], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(SeasonType, { each: true })
  types?: SeasonType[]

  @Field(() => [AdjustmentUnit], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(AdjustmentUnit, { each: true })
  units?: AdjustmentUnit[]

  @Field(() => [PriceModifierType], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(PriceModifierType, { each: true })
  actions?: PriceModifierType[]

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  apartmentId?: number
}
