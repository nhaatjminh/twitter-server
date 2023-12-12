import { MongoClient, Db, Collection } from 'mongodb'
import User from '~/models/schemas/User.schema'
import DB_COLLECTION from '~/constants/dbCollection'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Follower from '~/models/schemas/Follower.schema'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Bookmark from '~/models/schemas/Bookmark.schema'
import Like from '~/models/schemas/Like.schema'

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.9wcal9n.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error: ', error)
      throw error
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1', 'email_1_password_1', 'username_1'])
    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }

  async indexRefreshToken() {
    const exists = await this.refreshTokens.indexExists(['exp_1', 'token_1'])
    if (!exists) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    }
  }

  async indexVideoStatus() {
    const exists = await this.refreshTokens.indexExists(['name_1'])
    if (!exists) {
      this.videoStatus.createIndex({ name: 1 })
    }
  }

  async indexFollowers() {
    const exists = await this.refreshTokens.indexExists(['user_id_1_followed_user_id_1'])
    if (!exists) {
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(DB_COLLECTION.USER)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(DB_COLLECTION.TWEET)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(DB_COLLECTION.REFRESH_TOKENS)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(DB_COLLECTION.FOLLOWERS)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(DB_COLLECTION.VIDEO_STATUS)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection(DB_COLLECTION.HASHTAGS)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(DB_COLLECTION.BOOKMARKS)
  }

  get likes(): Collection<Like> {
    return this.db.collection(DB_COLLECTION.LIKES)
  }
}

const databaseService = new DatabaseService()
export default databaseService
