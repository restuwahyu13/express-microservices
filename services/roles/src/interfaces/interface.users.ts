import { Document } from 'mongoose'

export interface IUsers extends Document {
  _id: string
  name: string
  email: string
  password: string
  active: boolean
  roleId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}
