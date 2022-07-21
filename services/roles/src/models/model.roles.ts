import { model, Model as MongooseModel, models } from 'mongoose'
import { Model, Inject } from '@node/pkg'
import { IRoles } from '@interfaces/interface.roles'
import { RolesEntitie } from '@entities/entitie.roles'

@Model()
export class RolesModel {
  public model: MongooseModel<IRoles>

  constructor(@Inject('RolesEntitie') private entitie: RolesEntitie) {
    if (!models['Roles']) {
      this.model = model('Roles', this.entitie)
    } else {
      this.model = models['Roles']
    }
  }
}
