import { Router, Handler } from 'express'
import { Inject, Route } from '@node/pkg'

import { UsersController } from '@controllers/controller.users'
import { validator } from '@middlewares/middleware.validator'
import { AuthMiddleware } from '@middlewares/middleware.auth'
import { PermissionMiddleware } from '@middlewares/middleware.permission'
import { DTOLogin, DTORefreshToken, DTORegister } from '@dtos/dto.users'

@Route()
export class UsersRoute {
  private router: Router

  constructor(@Inject('UsersController') private controller: UsersController, @Inject('AuthMiddleware') private auth: AuthMiddleware, @Inject('PermissionMiddleware') private permission: PermissionMiddleware) {
    this.router = Router({ strict: true, caseSensitive: true })
  }

  main(): Router {
    this.router.post('/register', [validator(DTORegister)], this.controller.registerUsers())
    this.router.post('/login', [validator(DTOLogin)], this.controller.loginUsers())
    this.router.post('/', [this.auth.use(), this.permission.use(['admin'])], this.controller.createUsers())
    this.router.get('/', [this.auth.use(), this.permission.use(['admin'])], this.controller.getAllUsers())
    this.router.get('/:id', [this.auth.use(), this.permission.use(['admin', 'user'])], this.controller.getUsersById())
    this.router.delete('/:id', [this.auth.use(), this.permission.use(['admin'])], this.controller.deleteUsersById())
    this.router.put('/:id', [this.auth.use(), this.permission.use(['admin'])], this.controller.updateUsersById())
    this.router.post('/refresh-token', [validator(DTORefreshToken)], this.controller.refreshTokenUsers())
    this.router.post('/health-token', [this.auth.use(), this.permission.use(['admin', 'user'])], this.controller.healthTokenUsers())
    this.router.post('/revoke-token', [this.auth.use(), this.permission.use(['admin', 'user'])], this.controller.revokeTokenUsers())

    return this.router
  }
}
