import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class ChatTitleDto {
  @ApiProperty({
    description: 'Título del chat',
    example: 'Conversación sobre inteligencia artificial',
  })
  @IsString()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El título no debe exceder los 50 caracteres' })
  title?: string
}
