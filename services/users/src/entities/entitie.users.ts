import { Container } from '@node/pkg'
import { Schema, SchemaDefinitionProperty } from 'mongoose'

export class UsersEntitie extends Schema {
	email: SchemaDefinitionProperty = {
		type: String,
		unique: true,
		trim: true,
		required: true
	}

	password: SchemaDefinitionProperty = {
		type: String,
		trim: true,
		required: true
	}

	active: SchemaDefinitionProperty = {
		type: Boolean,
		default: false
	}

	roleId: SchemaDefinitionProperty = {
		type: String,
		trim: true,
		ref: 'roles',
		required: true
	}

	createdAt: SchemaDefinitionProperty = {
		type: Date,
		default: new Date()
	}

	updatedAt: SchemaDefinitionProperty = {
		type: Date,
		default: new Date()
	}

	deletedAt: SchemaDefinitionProperty = {
		type: Date,
		default: null
	}
}

Container.register<UsersEntitie>('UsersEntitie', { useClass: UsersEntitie })
