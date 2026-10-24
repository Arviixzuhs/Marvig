import { IsEnum, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export enum FileUploadVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export class UploadFileQueryDto {
  @ApiPropertyOptional({ enum: FileUploadVisibility, default: FileUploadVisibility.PUBLIC })
  @IsOptional()
  @IsEnum(FileUploadVisibility)
  visibility: FileUploadVisibility = FileUploadVisibility.PUBLIC
}
