import * as fs from 'fs'
import * as path from 'path'

export const getFileContent = async (folder: string, fileName: string): Promise<string> => {
  try {
    const sanitizedName = fileName.replace(/[\\\/]/g, '')
    const finalFileName = sanitizedName.endsWith('.md') ? sanitizedName : `${sanitizedName}.md`

    const baseDir = path.join(process.cwd(), folder)
    const targetPath = path.resolve(baseDir, finalFileName)
    if (!targetPath.startsWith(baseDir)) {
      throw new Error('Access denied')
    }

    if (!fs.existsSync(targetPath)) {
      return `No se encontró información en ${folder}/${finalFileName}`
    }
    return await fs.promises.readFile(targetPath, 'utf-8')
  } catch (error) {
    return 'Error interno al recuperar el archivo.'
  }
}
