import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '~/models/Other'

export interface TweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string // if `type` is comment, quotetweet, tweet and has no `mentions` and `hastags` then `content` must be a string and not empty.
  parent_id: null | string
  hashtags: string[]
  mentions: string[] // user_id[]
  media: Media
}
