import { Document } from 'mongoose'

export interface IRoles extends Document {
	_id: string
	name: string
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
}
