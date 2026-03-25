import { InputType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsInt, Min } from 'class-validator'

@InputType({ isAbstract: true })
export abstract class PaginationFilterDto {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number
}
