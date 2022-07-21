import { Router } from 'express'
import { Inject, Route } from '@node/pkg'

import { UsersController } from '@controllers/controller.users'

@Route()
export class UsersRoute {
	private router: Router

	constructor(@Inject('UsersController') private controller: UsersController) {
		this.router = Router({ strict: true, caseSensitive: true })
	}

	main(): Router {
		this.router.post('/auth/register', this.controller.registerUsers())
		this.router.post('/auth/login', this.controller.loginUsers())
		this.router.post('/', this.controller.createUsers())
		this.router.get('/', this.controller.getAllUsers())
		this.router.get('/', this.controller.getUsersById())
		this.router.delete('/', this.controller.deleteUsersById())
		this.router.put('/', this.controller.updateUsersById())

		return this.router
	}
}
