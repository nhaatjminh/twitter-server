import { Router } from 'express'
import { uploadImageController } from '~/controllers/media.controllers'
import { requestHandlerWrapper } from '~/utils/handlers'

const mediaRouter = Router()

mediaRouter.post('/upload-image', requestHandlerWrapper(uploadImageController))

export default mediaRouter
