import { Field, Float, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

@InputType()
export class ApartmentDto {
  @Field(() => Int)
  @IsInt({ message: 'El piso debe ser un número entero' })
  @IsNotEmpty({ message: 'El piso es obligatorio' })
  @Min(0)
  floor: number

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El número de apartamento es obligatorio' })
  @MaxLength(50, { message: 'El número no puede exceder los 50 caracteres' })
  number: string

  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  bedrooms: number

  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  bathrooms: number

  @Field(() => Float, { nullable: true })
  @IsNumber({}, { message: 'Los metros cuadrados deben ser un número' })
  @IsOptional()
  @Min(0)
  squareMeters?: number
}
