import { config } from 'dotenv'
config()

import express from 'express'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { initFolder } from './utils/files'
import usersRouter from './routes/users.routes'
import mediaRouter from './routes/media.routes'
import staticRouter from './routes/static.routes'
import { UPLOAD_VIDEO_DIR } from './constants/dir'

databaseService.connect()

const app = express()
const port = process.env.PORT || 5000

initFolder()

app.use(express.json())

app.use('/users', usersRouter)
app.use('/media', mediaRouter)
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
