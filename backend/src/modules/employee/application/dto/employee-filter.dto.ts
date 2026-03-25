import { InputType, Field, Int } from '@nestjs/graphql'
import { IsOptional, IsString, IsInt, Min } from 'class-validator'

@InputType()
export class EmployeeFilterDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  email?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string

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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fromDate?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  toDate?: string
}
