import { model, Model } from 'mongoose'
import { Inject, Controller } from '@node/pkg'
import { UsersEntitie } from '@entities/entitie.users'
import { IUsers } from '@interfaces/interface.users'

@Controller()
export class UsersModel {
	public model: Model<IUsers>

	constructor(@Inject('UsersEntitie') private entitie: UsersEntitie) {
		this.model = model('users', this.entitie) as any
	}
}
