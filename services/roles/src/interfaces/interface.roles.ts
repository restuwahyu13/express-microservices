import { Document } from 'mongoose'

export interface IRoles extends Document {
  _id: string
  name: string
  access: string[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}
