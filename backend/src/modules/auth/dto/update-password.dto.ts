import { ApiProperty } from '@nestjs/swagger'
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
    MaxLength,
} from 'class-validator'

export class PasswordResetCodeRequestDto {
    @ApiProperty({
        description: 'Código de confirmación de 5 dígitos.',
        example: '12345',
    })
    @IsNotEmpty({ message: 'El código es obligatorio.' })
    @IsString()
    @Length(5, 5, { message: 'El código debe tener exactamente 5 caracteres.' })
    @Matches(/^[0-9]*$/, { message: 'El código solo debe contener números.' })
    code: string

    @ApiProperty({
        description:
            'Nueva contraseña del usuario. Debe incluir al menos una mayúscula, un número y un carácter especial.',
        example: 'NuevaClave123*',
    })
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,100}$/, {
        message:
            'La contraseña debe incluir al menos una mayúscula, un número y un carácter especial.',
    })
    newPassword: string

    @ApiProperty({
        description: 'Correo del usuario',
        example: 'usuario@email.com',
    })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
    @IsString()
    @IsEmail({}, { message: 'El nuevo correo electrónico no es válido.' })
    @MaxLength(100, {
        message: 'El correo electrónico no debe superar los 100 caracteres.',
    })
    email: string

    @ApiProperty({
        description:
            'Nueva contraseña del usuario. Debe incluir al menos una mayúscula, un número y un carácter especial.',
        example: 'NuevaClave123*',
    })
    @IsNotEmpty({ message: 'La confirmación de contraseña es obligatoria.' })
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,100}$/, {
        message:
            'La contraseña debe incluir al menos una mayúscula, un número y un carácter especial.',
    })
    repeatNewPassword: string
}