import { InputType, Field, Int } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString, IsArray, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

@InputType()
export class OccupancyReportInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  fromDate: string

  @Field()
  @IsNotEmpty()
  @IsString()
  toDate: string

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  apartmentIds?: number[]
}
