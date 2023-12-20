import { Request, Response } from 'express'
import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import tweetsService from '~/services/tweets.services'
import { TokenPayload } from '~/models/requests/User.requests'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)
  return res.json({
    message: 'Create Tweet successfully',
    result
  })
}

export const getTweetController = async (req: Request, res: Response) => {
  
  return res.json({
    message: 'Create Tweet successfully',
    // result
  })
}