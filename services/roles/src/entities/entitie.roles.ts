import { Container } from '@node/pkg'
import { Schema, SchemaDefinitionProperty } from 'mongoose'

export class DatabaseSchema extends Schema {
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
}

class DatabaseConfigs extends DatabaseSchema {
  protected configs(): void {
    this.add({
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    })
  }
}

export class RolesEntitie extends DatabaseConfigs {
  constructor() {
    super()
    this.configs()
  }
}

Container.register('RolesEntitie', { useClass: RolesEntitie })
