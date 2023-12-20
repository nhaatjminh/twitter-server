import { Router } from 'express'
import { createTweetController, getTweetController } from '~/controllers/tweets.controllers'
import { createTweetValidator, tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { requestHandlerWrapper } from '~/utils/handlers'

const tweetsRouter = Router()

/**
 * Description. Create a tweet
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: TweetRequestBody
 */
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  requestHandlerWrapper(createTweetController)
)

/**
 * Description. Get Tweet
 * Path: /:tweet_id
 * Method: GET
 * Header: { Authorization?: Bearer <access_token> }
 */
tweetsRouter.get('/:tweet_id', tweetIdValidator, requestHandlerWrapper(getTweetController))

export default tweetsRouter
