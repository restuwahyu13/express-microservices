import { model, Model } from 'mongoose'
import { Inject, Controller } from '@node/pkg'
import { SecretsEntitie } from '@entities/entitie.secrets'
import { ISecrets } from '@interfaces/interface.secrets'

@Controller()
export class SecretsModel {
	public model: Model<ISecrets>

	constructor(@Inject('UsersEntitie') private entitie: SecretsEntitie) {
		this.model = model('secrets', this.entitie) as any
	}
}
