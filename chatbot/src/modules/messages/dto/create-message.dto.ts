import { AuthorType } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEnum, IsMongoId } from 'class-validator'

export class CreateMessageDto {
  @ApiProperty({
    description: 'Contenido del mensaje',
    example: 'Hola, ¿cómo estás?',
  })
  @IsString()
  content: string

  @ApiProperty({
    description: 'ID del chat al que pertenece el mensaje',
    example: '64f91cf76fbb7981e2e9d12a',
  })
  @IsMongoId({ message: 'chatId debe ser un ID de Mongo válido' })
  chatId: string

  @ApiProperty({
    enum: AuthorType,
    example: AuthorType.USER,
    description: 'Tipo de autor del mensaje (USER o CHATBOT)',
  })
  @IsEnum(AuthorType)
  authorType: AuthorType
}
