import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHLSController,
  videoStatusController
} from '~/controllers/media.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { requestHandlerWrapper } from '~/utils/handlers'

const mediaRouter = Router()

mediaRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  requestHandlerWrapper(uploadImageController)
)

mediaRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  requestHandlerWrapper(uploadVideoController)
)

mediaRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifiedUserValidator,
  requestHandlerWrapper(uploadVideoHLSController)
)

mediaRouter.get(
  '/video-status/:id',
  accessTokenValidator,
  verifiedUserValidator,
  requestHandlerWrapper(videoStatusController)
)

export default mediaRouter
