import { Router } from 'express'
import {
  emailVerifyController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
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
 * Header: { Authoriztion: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, requestHandlerWrapper(logoutController))

/**
 * Description. VErify email when user client click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, requestHandlerWrapper(emailVerifyController))

/**
 * Description. Resend verify email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authoriztion: Bearer <access_token> }
 * Body: { }
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, requestHandlerWrapper(resendVerifyEmailController))

export default usersRouter
