import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

@InputType()
export class UserDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string

  @Field({ nullable: true })
  @IsEmail({}, { message: 'El formato del correo es inválido' })
  @IsOptional()
  email?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string
}
