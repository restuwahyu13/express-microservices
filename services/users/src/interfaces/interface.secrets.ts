import { Document } from 'mongoose'

export interface ISecrets extends Document {
	_id: string
	resourceBy: string
	resourceType: string
	accessToken: string
	refreshToken: string
	expiredAt: Date
	createdAt: Date
}
