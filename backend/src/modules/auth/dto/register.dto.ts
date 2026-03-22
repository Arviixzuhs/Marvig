import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
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

  @ApiProperty({
    example: 'contraseñaSegura123!',
    description: 'La contraseña del nuevo usuario.',
  })
  @IsNotEmpty({ message: 'La contraseña no debe estar vacía.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Matches(/(?=.*[0-9])/, { message: 'La contraseña debe contener al menos un número.' })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'La contraseña debe contener al menos un símbolo especial.',
  })
  password: string

  @ApiProperty({
    example: 'contraseñaSegura123!',
    description: 'La contraseña del nuevo usuario.',
  })
  @IsNotEmpty({ message: 'La contraseña no debe estar vacía.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Matches(/(?=.*[0-9])/, { message: 'La contraseña debe contener al menos un número.' })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'La contraseña debe contener al menos un símbolo especial.',
  })
  repeatPassword: string
}
