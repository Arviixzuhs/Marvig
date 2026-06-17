import { IsString, IsNotEmpty, IsMongoId } from 'class-validator'

export class AskQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  chatId: string

  @IsString()
  @IsNotEmpty()
  userMessage: string
}
