import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import DB_COLLECTION from '~/constants/dbCollection'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Follower from '~/models/schemas/Follower.schema'

config()
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

  get users(): Collection<User> {
    return this.db.collection(DB_COLLECTION.USER)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(DB_COLLECTION.REFRESH_TOKENS)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(DB_COLLECTION.FOLLOWERS)
  }
}

const databaseService = new DatabaseService()
export default databaseService
