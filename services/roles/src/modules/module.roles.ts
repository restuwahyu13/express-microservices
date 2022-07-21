import { Module, Injectable, Inject } from '@node/pkg'
import { RolesService } from '@services/service.roles'
import { RolesController } from '@controllers/controller.roles'
import { RolesRoute } from '@routes/route.roles'
import { RolesModel } from '@models/model.roles'
import { AuthMiddleware } from '@middlewares/middleware.auth'
import { PermissionMiddleware } from '@middlewares/middleware.permission'

@Module([
  { token: 'RolesService', useClass: RolesService },
  { token: 'RolesController', useClass: RolesController },
  { token: 'RolesRoute', useClass: RolesRoute },
  { token: 'RolesModel', useClass: RolesModel },
  { token: 'AuthMiddleware', useClass: AuthMiddleware },
  { token: 'PermissionMiddleware', useClass: PermissionMiddleware }
])
@Injectable()
export class RolesModule {
  constructor(@Inject('RolesRoute') public route: RolesRoute) {}
}
