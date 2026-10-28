import { UserRole } from '@/common/enums/user-role.enum'
import { FileService } from './file.service'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { memoryStorage } from 'multer'
import { Express, Response } from 'express'
import { UploadFileQueryDto } from './dto/upload-file-query.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import {
  Res,
  Get,
  Post,
  Param,
  Query,
  Controller,
  UploadedFile,
  UploadedFiles,
  ValidationPipe,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'

const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
}

const queryPipe = new ValidationPipe({ transform: true, whitelist: true })

@Controller('file')
@ApiTags('Consult')
@ApiBearerAuth()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @RequiredRole(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query(queryPipe) query: UploadFileQueryDto,
  ) {
    if (!file) throw new BadRequestException('Se requiere un archivo.')

    const filename = this.fileService.saveFile(file, query.visibility)
    const fileUrl = this.fileService.generateFileUrl(filename, query.visibility)
    return { message: 'File uploaded successfully!', fileUrl }
  }

  @Post('uploads')
  @RequiredRole(UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query(queryPipe) query: UploadFileQueryDto,
  ) {
    if (!files?.length) throw new BadRequestException('Se requiere al menos un archivo.')

    const fileUrls = files.map((file) => {
      const filename = this.fileService.saveFile(file, query.visibility)
      return this.fileService.generateFileUrl(filename, query.visibility)
    })
    return { message: 'Files uploaded successfully!', fileUrls }
  }

  @Get('private/:filename')
  @RequiredRole(UserRole.ADMIN)
  getPrivateFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.fileService.getPrivateFilePath(filename)
    if (!filePath) throw new NotFoundException('Archivo no encontrado.')
    return res.sendFile(filePath)
  }
}
