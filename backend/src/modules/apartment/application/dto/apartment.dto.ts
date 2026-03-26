import { Transform } from 'class-transformer'
import { Field, InputType } from '@nestjs/graphql'
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator'

@InputType()
export class ApartmentDto {
  @Field(() => String)
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'El piso debe ser un número entero' })
  @Min(0)
  floor: number

  @Field()
  @IsString()
  number: string

  @Field(() => String, { defaultValue: '1' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  bedrooms: number

  @Field(() => String, { defaultValue: '1' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  bathrooms?: number

  @Field(() => String, { nullable: true })
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsNumber()
  @IsOptional()
  squareMeters?: number
}
