import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { accessTokenValidator, loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { requestHandlerWrapper } from '~/utils/handlers'
const usersRouter = Router()

/**
 * Description. login a user
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */
usersRouter.post('/login', loginValidator, requestHandlerWrapper(loginController))

/**
 * Description. Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string,  confirm_password: string, date_of_birth: ISO8601 }
 */
usersRouter.post('/register', registerValidator, requestHandlerWrapper(registerController))

/**
 * Description. logout a user
 * Path: /logout
 * Method: POST
 * Body: { refresh_token: string }
 */
usersRouter.post('/logout', accessTokenValidator, requestHandlerWrapper((req, res) => {
  res.json({message: 'Logout successfully'})
}))

export default usersRouter
