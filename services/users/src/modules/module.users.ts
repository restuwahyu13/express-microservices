import { Module, Injectable, Inject } from '@node/pkg'

import { UsersService } from '@services/service.users'
import { UsersController } from '@controllers/controller.users'
import { UsersRoute } from '@routes/route.users'
import { UsersModel } from '@models/model.users'
import { SecretsModel } from '@models/model.secrets'
import { RolesModel } from '@models/model.roles'
import { AuthMiddleware } from '@middlewares/middleware.auth'
import { PermissionMiddleware } from '@middlewares/middleware.permission'

@Module([
  { token: 'UsersService', useClass: UsersService },
  { token: 'UsersController', useClass: UsersController },
  { token: 'UsersRoute', useClass: UsersRoute },
  { token: 'UsersModel', useClass: UsersModel },
  { token: 'SecretsModel', useClass: SecretsModel },
  { token: 'RolesModel', useClass: RolesModel },
  { token: 'AuthMiddleware', useClass: AuthMiddleware },
  { token: 'PermissionMiddleware', useClass: PermissionMiddleware }
])
@Injectable()
export class UsersModule {
  constructor(@Inject('UsersRoute') public route: UsersRoute) {}
}
