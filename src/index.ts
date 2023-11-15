import { config } from 'dotenv'
config()

import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediaRouter from './routes/media.routes'
import { initFolder } from './utils/files'
import { UPLOAD_DIR } from './constants/dir'

databaseService.connect()

const app = express()
const port = process.env.PORT || 5000

initFolder()

app.use(express.json())

app.use('/users', usersRouter)
app.use('/media', mediaRouter)
app.use('/static', express.static(UPLOAD_DIR))

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
