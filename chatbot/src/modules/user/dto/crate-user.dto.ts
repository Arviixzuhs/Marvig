import { IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({
    description: 'ID único del usuario (puede provenir de un proveedor externo)',
    example: 1,
  })
  @IsNumber()
  userId: number
}
