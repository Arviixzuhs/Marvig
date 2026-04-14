import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GoogleAuthDto {
  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...',
    description: 'ID Token JWT firmado por Google Identity Services.',
  })
  @IsString()
  @IsNotEmpty({ message: 'El token de Google no debe estar vacío.' })
  credential: string
}
