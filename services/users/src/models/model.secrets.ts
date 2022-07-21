import { model, Model as MongooseModel, models } from 'mongoose'
import { Model, Inject } from '@node/pkg'
import { SecretsEntitie } from '@entities/entitie.secrets'
import { ISecrets } from '@interfaces/interface.secrets'

@Model()
export class SecretsModel {
  public model: MongooseModel<ISecrets>

  constructor(@Inject('SecretsEntitie') private entitie: SecretsEntitie) {
    if (!models['Secrets']) {
      this.model = model('Secrets', this.entitie)
    } else {
      this.model = models['Secrets']
    }
  }
}
