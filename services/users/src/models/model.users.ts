import { model, Model as MongooseModel, models } from 'mongoose'
import { Inject, Model } from '@node/pkg'
import { UsersEntitie } from '@entities/entitie.users'
import { IUsers } from '@interfaces/interface.users'

@Model()
export class UsersModel {
  public model: MongooseModel<IUsers>

  constructor(@Inject('UsersEntitie') private entitie: UsersEntitie) {
    if (!models['Users']) {
      this.model = model('Users', this.entitie)
    } else {
      this.model = models['Users']
    }
  }
}
