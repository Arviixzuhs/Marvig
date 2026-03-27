import * as fs from 'fs'
import { join } from 'path'
import { config } from 'dotenv'
import { Injectable } from '@nestjs/common'

config()
@Injectable()
export class FileService {
  // Ruta base de almacenamiento
  private readonly uploadPath = './uploads'

  generateFileUrl(filename: string): string {
    const { HOST, PORT } = process.env
    return `http://${HOST}:${PORT}/uploads/${filename}`
  }

  deleteFile(filename: string): void {
    const filePath = join(this.uploadPath, filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    } else {
      throw new Error('File not found')
    }
  }

  validateFileType(file: Express.Multer.File, allowedTypes: string[]): void {
    const fileType = file.mimetype
    if (!allowedTypes.includes(fileType)) {
      throw new Error(`Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`)
    }
  }

  saveFile(file: Express.Multer.File, directory: string = this.uploadPath): string {
    // Crear la carpeta si no existe
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }

    // Generar un nombre único para el archivo
    const timestamp = Date.now()
    const sanitized = file.originalname.replace(/\s+/g, '_') // reemplaza espacios
    const filename = `${timestamp}-${sanitized}`

    const filePath = join(directory, filename)

    // Guardar el archivo
    fs.writeFileSync(filePath, file.buffer)

    return filename // DEVOLVEMOS EL NOMBRE, no la ruta completa
  }
}
