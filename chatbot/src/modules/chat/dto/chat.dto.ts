import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumber } from 'class-validator'

export class ChatDto {
  @ApiProperty({
    description: 'Título del chat',
    example: 'Conversación sobre inteligencia artificial',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({
    description: 'Resumen acumulado de la conversación',
    example: 'El usuario preguntó por precios de suscripciones y se le informó sobre el plan Pro.',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiProperty({
    description: 'Contador de mensajes activos para el límite de contexto',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  messageCount?: number
}
