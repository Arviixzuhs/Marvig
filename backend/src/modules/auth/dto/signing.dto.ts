import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SigningDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'El correo electrónico del nuevo usuario.',
  })
  @IsEmail({}, { message: 'El correo debe ser un correo electrónico válido.' })
  email: string

  @ApiProperty({
    example: 'Victor',
    description: 'El nombre de usuario.',
  })
  @IsNotEmpty({ message: 'El nombre de usuario no debe estar vacío.' })
  @IsString()
  name: string

  @ApiProperty({
    example: 'Pandolfi',
    description: 'El apellido de usuario.',
  })
  @IsNotEmpty({ message: 'El apellido de usuario no debe estar vacío.' })
  @IsString()
  lastName: string
}
