import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

export class ConfirmSigningDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2Vy',
    description: 'Token de confirmación',
  })
  @IsNotEmpty({ message: 'El token es obligatorio.' })
  @IsString()
  token: string

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
