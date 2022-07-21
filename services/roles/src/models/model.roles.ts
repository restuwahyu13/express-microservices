import { model, Model } from 'mongoose'
import { Controller, Inject } from '@node/pkg'
import { IRoles } from '@interfaces/interface.roles'
import { RolesEntitie } from '@entities/entitie.roles'

@Controller()
export class RolesModel {
  public model: Model<IRoles>

  constructor(@Inject('RolesEntitie') private schema: RolesEntitie) {
    this.model = model('Roles', this.schema)
  }
}
