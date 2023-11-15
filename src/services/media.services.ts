import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import { getFileName, handleUploadSingleImage } from '~/utils/files'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'

class MediaService {
  async handleUploadImage(req: Request) {
    const baseUrl = isProduction ? `${process.env.HOST}/static/image` : `http://localhost:${process.env.PORT}/static/image`
    const files = await handleUploadSingleImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getFileName(file.newFilename)
        const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: `${baseUrl}/${newName}`,
          type: MediaType.Image
        }
      })
    )

    return result
  }
}

const mediaService = new MediaService()

export default mediaService
