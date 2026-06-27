import { DateFilterInput } from '@/common/graphql/inputs/date-filter.input'
import { PromotionTypeEnum } from '@/modules/promotion/domain/enums/promotion-type.enum'
import { PaginationFilterInput } from '@/common/graphql/inputs/pagination-filter.input'
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
import { InputType, Field, IntersectionType } from '@nestjs/graphql'

@InputType()
export class PromotionFilterInput extends IntersectionType(PaginationFilterInput, DateFilterInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => [PromotionTypeEnum], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'El tipo debe ser un arreglo de tipos de promociones' })
  @IsEnum(PromotionTypeEnum, { each: true, message: 'Cada tipo debe ser un valor válido' })
  type?: PromotionTypeEnum[]
}
