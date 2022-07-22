import { Container } from '@node/pkg'
import { Schema, SchemaDefinitionProperty } from 'mongoose'

class DatabaseSchema extends Schema {
  resourceBy: SchemaDefinitionProperty = {
    type: String,
    trim: true,
    required: true
  }

  resourceType: SchemaDefinitionProperty = {
    type: String,
    trim: true,
    required: true
  }

  accessToken: SchemaDefinitionProperty = {
    type: String,
    trim: true,
    default: false
  }

  refreshToken: SchemaDefinitionProperty = {
    type: String,
    trim: true,
    required: true
  }

  expiredAt: SchemaDefinitionProperty = {
    type: Date,
    trim: true,
    default: null
  }

  createdAt: SchemaDefinitionProperty = {
    type: Date,
    default: new Date()
  }
}

class DatabaseConfigs extends DatabaseSchema {
  protected configs(): void {
    this.add({
      resourceBy: this.resourceBy,
      resourceType: this.resourceType,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiredAt: this.expiredAt,
      createdAt: this.createdAt
    })
  }
}

export class SecretsEntitie extends DatabaseConfigs {
  constructor() {
    super()
    this.configs()
  }
}

Container.register<SecretsEntitie>('SecretsEntitie', { useClass: SecretsEntitie })
