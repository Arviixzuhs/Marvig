import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty({ message: 'La contraseña actual es obligatoria.' })
  @IsString()
  currentPassword: string

  @Field()
  @IsNotEmpty({ message: 'La nueva contraseña no debe estar vacía.' })
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres.' })
  @Matches(/(?=.*[A-Z])/, { message: 'La nueva contraseña debe contener al menos una mayúscula.' })
  @Matches(/(?=.*[a-z])/, { message: 'La nueva contraseña debe contener al menos una minúscula.' })
  @Matches(/(?=.*[0-9])/, { message: 'La nueva contraseña debe contener al menos un número.' })
  @IsString()
  newPassword: string

  @Field()
  @IsNotEmpty({ message: 'Confirmar la nueva contraseña es obligatorio.' })
  @IsString()
  confirmPassword: string
}
