import * as fs from 'fs'
import { config } from 'dotenv'
import { randomBytes } from 'crypto'
import { Injectable } from '@nestjs/common'
import { FileUploadVisibility } from './dto/upload-file-query.dto'
import { join, resolve, basename, extname, parse, sep } from 'path'

config()
@Injectable()
export class FileService {
  private readonly uploadPath = resolve(process.cwd(), 'uploads')
  private readonly privateUploadPath = resolve(process.cwd(), 'private-uploads')

  private getDirectory(visibility: FileUploadVisibility): string {
    return visibility === FileUploadVisibility.PRIVATE ? this.privateUploadPath : this.uploadPath
  }

  generateFileUrl(
    filename: string,
    visibility: FileUploadVisibility = FileUploadVisibility.PUBLIC,
  ): string {
    return visibility === FileUploadVisibility.PRIVATE
      ? `${process.env.API_URL}/file/private/${filename}`
      : `${process.env.API_URL}/uploads/${filename}`
  }

  getPrivateFilePath(filename: string): string | null {
    const safeName = basename(filename)
    const filePath = join(this.privateUploadPath, safeName)

    if (!filePath.startsWith(this.privateUploadPath + sep)) return null
    if (!fs.existsSync(filePath)) return null

    return filePath
  }

  deleteFile(
    filename: string,
    visibility: FileUploadVisibility = FileUploadVisibility.PUBLIC,
  ): void {
    const baseDir = this.getDirectory(visibility)
    const filePath = join(baseDir, basename(filename))

    if (!fs.existsSync(filePath)) throw new Error('File not found')
    fs.unlinkSync(filePath)
  }

  validateFileType(file: Express.Multer.File, allowedTypes: string[]): void {
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`)
    }
  }

  saveFile(
    file: Express.Multer.File,
    visibility: FileUploadVisibility = FileUploadVisibility.PUBLIC,
  ): string {
    const directory = this.getDirectory(visibility)
    fs.mkdirSync(directory, { recursive: true })

    const name = parse(file.originalname).name.replace(/[^a-zA-Z0-9_-]/g, '_')
    const filename = `${name}-${randomBytes(8).toString('hex')}${extname(file.originalname)}`

    fs.writeFileSync(join(directory, filename), file.buffer)

    return filename
  }
}
