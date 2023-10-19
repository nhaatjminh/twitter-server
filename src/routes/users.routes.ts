import { Router } from 'express'
const usersRouter = Router()

usersRouter.use((req, res, next) => {
  next()
})

usersRouter.get('/tweet', (req, res) => {
  res.json({ message: 'hello world' })
})

export default usersRouter
