import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import { USERS_MESSAGES } from '~/constants/messages'
import mediaService from '~/services/media.services'

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const url = await mediaService.handleUploadSingleImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveImageController = (req: Request, res: Response) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_DIR, name + '.jpg'), (err) => {
    res.status((err as any).status).send('Not found')
  })
}
