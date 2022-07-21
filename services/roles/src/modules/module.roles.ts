import { Module, Injectable, Inject } from '@node/pkg'

import { RolesService } from '@services/service.roles'
import { RolesController } from '@/controllers/controller.roles'
import { RolesRoute } from '@routes/route.roles'
import { RolesModel } from '@models/model.roles'

@Module([
  { token: 'RolesService', useClass: RolesService },
  { token: 'RolesController', useClass: RolesController },
  { token: 'RolesRoute', useClass: RolesRoute },
  { token: 'RolesModel', useClass: RolesModel }
])
@Injectable()
export class RolesModule {
  constructor(@Inject('RolesRoute') public route: RolesRoute) {}
}
