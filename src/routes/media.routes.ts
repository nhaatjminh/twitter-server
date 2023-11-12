import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/media.controllers'
import { requestHandlerWrapper } from '~/utils/handlers'

const mediaRouter = Router()

mediaRouter.post('/upload-image', requestHandlerWrapper(uploadSingleImageController))

export default mediaRouter
