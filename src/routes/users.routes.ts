import { Router } from 'express'
import {
  emailVerifyController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { filterMiddleWare } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
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

/**
 * Description. Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, requestHandlerWrapper(forgotPasswordController))

/**
 * Description. Verify link in email to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
  '/verify-forgot-password',
  forgotPasswordTokenValidator,
  requestHandlerWrapper(verifyForgotPasswordController)
)

/**
 * Description. Reset password
 * Path: /reset-password
 * Method: POST
 * Body: { forgot_password_token: string, password: string, confirm_password: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, requestHandlerWrapper(resetPasswordController))

/**
 * Description. Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authoriztion: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokenValidator, requestHandlerWrapper(getMeController))

/**
 * Description. Update my profile
 * Path: /me
 * Method: PATCH
 * Header: { Authoriztion: Bearer <access_token> }
 * Body: UserSchema
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleWare<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  requestHandlerWrapper(updateMeController)
)

/**
 * Description. Get user profile
 * Path: /:username
 * Method: GET
 */
usersRouter.get('/:username', requestHandlerWrapper(getProfileController))

/**
 * Description. Follow other user
 * Path: /follow
 * Method: POST
 * Header: { Authoriztion: Bearer <access_token> }
 * Body: { user_id: string }
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  requestHandlerWrapper(followController)
)

/**
 * Description. Unfollow other user
 * Path: /follow/:user_id
 * Method: DELETE
 * Header: { Authoriztion: Bearer <access_token> }
 */
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  requestHandlerWrapper(unfollowController)
)

export default usersRouter
