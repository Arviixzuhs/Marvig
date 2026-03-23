import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

@InputType()
export class EmployeeDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
  name: string

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(50, { message: 'El apellido no puede exceder los 50 caracteres' })
  lastName: string

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @MaxLength(50, { message: 'El teléfono no puede exceder los 50 caracteres' })
  phone: string

  @Field()
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @MaxLength(150, { message: 'El correo no puede exceder los 150 caracteres' })
  email: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'La dirección no puede exceder los 200 caracteres' })
  address?: string
}
