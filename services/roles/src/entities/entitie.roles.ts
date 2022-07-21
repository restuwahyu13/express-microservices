import { Container } from '@node/pkg'
import { Schema, SchemaDefinitionProperty } from 'mongoose'
import shortid from 'shortid'

export class RolesEntitie extends Schema {
  name: SchemaDefinitionProperty = {
    type: String,
    unique: true,
    trim: true,
    required: true
  }

  access: SchemaDefinitionProperty = {
    type: Array<String>,
    required: true
  }

  userId: SchemaDefinitionProperty = {
    type: String,
    ref: 'Users',
    default: shortid.generate()
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
      access: this.access,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    })
  }
}

Container.register('RolesEntitie', { useClass: RolesEntitie })
