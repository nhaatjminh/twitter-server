import { Router } from 'express'
import { bookmarkTweetController, unbookmarkTweetController } from '~/controllers/bookmarks.controllers'
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

/**
 * Description: Unbookmark tweet
 * Path: /:tweet_id
 * Method: DELETE
 * Body: { tweet_id: string }
 * Header: { Authoriztion: Bearer <access_token> }
 */
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  requestHandlerWrapper(unbookmarkTweetController)
)

export default bookmarksRouter
