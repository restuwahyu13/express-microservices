import { Container } from '@node/pkg'
import { Schema, SchemaDefinitionProperty } from 'mongoose'

export class RolesEntitie extends Schema {
	name: SchemaDefinitionProperty = {
		type: String,
		unique: true,
		trim: true,
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
			name: this.name,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			deletedAt: this.deletedAt
		})
	}
}

Container.register('RolesEntitie', { useClass: RolesEntitie })
