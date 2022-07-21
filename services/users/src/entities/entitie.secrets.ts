import { Container } from '@node/pkg'
import { Schema, SchemaDefinitionProperty } from 'mongoose'

export class SecretsEntitie extends Schema {
	resourceBy: SchemaDefinitionProperty = {
		type: String,
		required: true
	}

	resourceType: SchemaDefinitionProperty = {
		type: String,
		trim: true,
		required: true
	}

	accessToken: SchemaDefinitionProperty = {
		type: String,
		default: false
	}

	refreshToken: SchemaDefinitionProperty = {
		type: String,
		required: true
	}

	expiredAt: SchemaDefinitionProperty = {
		type: Date,
		default: null
	}

	createdAt: SchemaDefinitionProperty = {
		type: Date,
		default: new Date()
	}
}

Container.register<SecretsEntitie>('SecretsEntitie', { useClass: SecretsEntitie })
