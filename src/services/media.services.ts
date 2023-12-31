import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getFileName, handleUploadImage, handleUploadVideo } from '~/utils/files'
import fs from 'fs'
import fsPromise from 'fs/promises'
import { isProduction } from '~/constants/config'
import { EncodingStatus, MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import { uploadFileToS3 } from '~/utils/s3'
import mime from 'mime'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }

  async enqueue(item: string) {
    this.items.push(item)
    // item = ....../download/id.m3u8
    const idName = getFileName(item.split('\\').pop() as string)
    await databaseService.videoStatus.insertOne(
      new VideoStatus({
        name: idName,
        status: EncodingStatus.Pending
      })
    )

    this.processEncode()
  }

  async processEncode() {
    if (this.encoding) return
    if (this.items.length) {
      this.encoding = true
      const videoPath = this.items[0]
      const idName = getFileName(videoPath.split('\\').pop() as string)
      await databaseService.videoStatus.updateOne(
        {
          name: idName
        },
        {
          $set: {
            status: EncodingStatus.Processing
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        fs.unlink(videoPath, (err) => {
          if (err) console.log(err)
        })
        databaseService.videoStatus.updateOne(
          {
            name: idName
          },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              updated_at: true
            }
          }
        )
        console.error(`Encode video ${videoPath} success`)
      } catch (error) {
        databaseService.videoStatus
          .updateOne(
            {
              name: idName
            },
            {
              $set: {
                status: EncodingStatus.Failed
              },
              $currentDate: {
                updated_at: true
              }
            }
          )
          .catch((err) => {
            console.log('Update video status error', err)
          })
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
        const newFullFileName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          filename: newFullFileName,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })

        Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])

        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
        // return {
        //   url: `${baseUrl}/${newFullFileName}`,
        //   type: MediaType.Image
        // }
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

  async getVideoStatus(id: string) {
    const data = await databaseService.videoStatus.findOne({ name: id })
    return data
  }
}

const mediaService = new MediaService()

export default mediaService
