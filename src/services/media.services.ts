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

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }

  enqueue(item: string) {
    this.items.push(item)
    this.processEncode()
  }

  async processEncode() {
    if (this.encoding) return
    if (this.items.length) {
      this.encoding = true
      const videoPath = this.items[0]
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        fs.unlink(videoPath, (err) => {
          if (err) console.log(err)
        })
        console.error(`Encode video ${videoPath} success`)
      } catch (error) {
        console.error(`Encode video ${videoPath} error`)
        console.error(error)
      }
      this.encoding = false
      this.processEncode()
    } else {
      console.log('Encode video queue is empty')
    }
  }
}

const queue = new Queue()

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
        queue.enqueue(file.filepath)
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
