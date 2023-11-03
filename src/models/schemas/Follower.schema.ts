import { ObjectId } from 'mongodb'

interface FollowerType {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  created_at?: Date
}
export default class Follower {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  created_at: Date
  constructor({ user_id, followed_user_id }: FollowerType) {
    this.user_id = user_id
    this.followed_user_id = followed_user_id
    this.created_at = new Date()
  }
}