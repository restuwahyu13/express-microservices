import { Router } from 'express'
import { Inject, Route } from '@node/pkg'

import { RolesController } from '@/controllers/controller.roles'
import { validator } from '@middlewares/middleware.validator'
import { DTORoles, DTORolesId } from '@dtos/dto.roles'

@Route()
export class RolesRoute {
  private router: Router

  constructor(@Inject('RolesController') private controller: RolesController) {
    this.router = Router({ strict: true, caseSensitive: true })
  }

  main(): Router {
    this.router.post('/', [validator(DTORoles)], this.controller.createRoles())
    this.router.get('/', this.controller.getAllRoles())
    this.router.get('/:id', [validator(DTORolesId)], this.controller.getRolesById())
    this.router.delete('/:id', [validator(DTORolesId)], this.controller.deleteRolesById())
    this.router.put('/:id', [validator(DTORoles)], this.controller.updateRolesById())

    return this.router
  }
}
