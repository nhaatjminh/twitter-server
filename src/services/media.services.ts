import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getFileName, handleUploadImage, handleUploadVideo } from '~/utils/files'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'

class MediaService {
  async handleUploadImage(req: Request) {
    const baseUrl = isProduction
      ? `${process.env.HOST}/static/image`
      : `http://localhost:${process.env.PORT}/static/image`
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getFileName(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: `${baseUrl}/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )

    return result
  }

  async handleUploadVideo(req: Request) {
    const baseUrl = isProduction
      ? `${process.env.HOST}/static/video`
      : `http://localhost:${process.env.PORT}/static/video`
    const files = await handleUploadVideo(req)
    const result = files.map((file) => {
      const { newFilename } = file
      return {
        url: `${baseUrl}/${newFilename}`,
        type: MediaType.Video
      }
    })

    return result
  }

  async handleUploadVideoHLS(req: Request) {
    const baseUrl = isProduction
      ? `${process.env.HOST}/static/video`
      : `http://localhost:${process.env.PORT}/static/video`
    const files = await handleUploadVideo(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        await encodeHLSWithMultipleVideoStreams(file.filepath)
        fs.unlink(file.filepath, (err) => {
          if (err) console.log(err)
        })
        const newName = getFileName(file.newFilename)
        return {
          url: `${baseUrl}/${newName}`,
          type: MediaType.HLS
        }
      })
    )

    return result
  }
}

const mediaService = new MediaService()

export default mediaService
