import { extname } from 'path'
import { Express } from 'express'
import { diskStorage } from 'multer'
import { FileService } from './file.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { Controller, Post, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common'

@Controller('file')
@ApiTags('Consult')
@ApiBearerAuth()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const name = file.originalname.split('.')[0]
          const fileExtName = extname(file.originalname)
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.random().toString(36).substring(2, 15))
            .join('')
          callback(null, `${name}-${randomName}${fileExtName}`)
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = this.fileService.generateFileUrl(file.filename)
    return {
      message: 'File uploaded successfully!',
      fileUrl,
    }
  }

  @Post('uploads')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const name = file.originalname.split('.')[0]
          const fileExtName = extname(file.originalname)
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.random().toString(36).substring(2, 15))
            .join('')
          callback(null, `${name}-${randomName}${fileExtName}`)
        },
      }),
    }),
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const fileUrls = files.map((file) => this.fileService.generateFileUrl(file.filename))
    return {
      message: 'Files uploaded successfully!',
      fileUrls,
    }
  }
}
