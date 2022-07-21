import { Container } from '@node/pkg'
import { Schema, SchemaDefinitionProperty, Types } from 'mongoose'

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
		type: Types.ObjectId,
		ref: 'Roles',
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

	constructor() {
		super()
		this.add({
			email: this.email,
			password: this.password,
			active: this.active,
			roleId: this.roleId,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			deletedAt: this.deletedAt
		})
	}
}

Container.register<UsersEntitie>('UsersEntitie', { useClass: UsersEntitie })
