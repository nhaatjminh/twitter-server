import { Router } from 'express'
import { bookmarkTweetController } from '~/controllers/bookmarks.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { requestHandlerWrapper } from '~/utils/handlers'

const bookmarksRouter = Router()

/**
 * Description: Bookmark tweet
 * Path: /
 * Method: POST
 * Body: { tweet_id: string }
 * Header: { Authoriztion: Bearer <access_token> }
 */
bookmarksRouter.post('/', accessTokenValidator, verifiedUserValidator, requestHandlerWrapper(bookmarkTweetController))

export default bookmarksRouter
