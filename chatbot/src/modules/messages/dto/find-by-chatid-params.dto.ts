import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsMongoId, IsOptional, IsInt, Min } from 'class-validator'

export class FindByChatIdParamsDto {
  @ApiProperty({ example: '64f91cf76fbb7981e2e9d12a' })
  @IsMongoId({ message: 'chatId must be a valid MongoDB ObjectId' })
  chatId: string

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 20
}
