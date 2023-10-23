import express, { NextFunction, Request, Response } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'

const app = express()
const port = 3000

databaseService.connect()

app.use(express.json())

app.use('/users', usersRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Error', err.message)
  res.status(500).json({ error: err.message })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
