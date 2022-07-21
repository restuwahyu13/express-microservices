import { Router } from 'express'
import { Inject, Route } from '@node/pkg'

import { RolesController } from '@/controllers/controller.roles'
import { validator } from '@middlewares/middleware.validator'
import { AuthMiddleware } from '@middlewares/middleware.auth'
import { PermissionMiddleware } from '@middlewares/middleware.permission'
import { DTORoles, DTORolesId } from '@dtos/dto.roles'

@Route()
export class RolesRoute {
  private router: Router

  constructor(
    @Inject('RolesController') private controller: RolesController,
    @Inject('AuthMiddleware') private auth: AuthMiddleware,
    @Inject('PermissionMiddleware') private permission: PermissionMiddleware
  ) {
    this.router = Router({ strict: true, caseSensitive: true })
  }

  main(): Router {
    this.router.post('/', [this.auth.use(), this.permission.use(['admin']), validator(DTORoles)], this.controller.createRoles())
    this.router.get('/', [this.auth.use(), this.permission.use(['admin'])], this.controller.getAllRoles())
    this.router.get('/:id', [this.auth.use(), this.permission.use(['admin']), validator(DTORolesId)], this.controller.getRolesById())
    this.router.delete('/:id', [this.auth.use(), this.permission.use(['admin']), validator(DTORolesId)], this.controller.deleteRolesById())
    this.router.put('/:id', [this.auth.use(), this.permission.use(['admin']), validator(DTORoles)], this.controller.updateRolesById())

    return this.router
  }
}
