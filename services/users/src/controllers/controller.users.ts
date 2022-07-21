import { Request, Response, Handler, NextFunction } from 'express'
import { OutgoingMessage } from 'http'
import { Controller, Inject, APIResponse } from '@node/pkg'

import { UsersService } from '@services/service.users'

@Controller()
export class UsersController {
	constructor(@Inject('UsersService') private service: UsersService) {}

	registerUsers(): Handler {
		return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
			try {
				const response: APIResponse = await this.service.registerUsers(req.body)
				return res.status(response.stat_code).json(response)
			} catch (e: any) {
				return res.status(e.stat_code).json(e)
			}
		}
	}

	loginUsers(): Handler {
		return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
			try {
				const response: APIResponse = await this.service.loginUsers(req.body)
				return res.status(response.stat_code).json(response)
			} catch (e: any) {
				return res.status(e.stat_code).json(e)
			}
		}
	}

	createUsers(): Handler {
		return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
			try {
				const response: APIResponse = await this.service.createUsers(req.body)
				return res.status(response.stat_code).json(response)
			} catch (e: any) {
				return res.status(e.stat_code).json(e)
			}
		}
	}

	getAllUsers(): Handler {
		return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
			try {
				const response: APIResponse = await this.service.getAllUsers()
				return res.status(response.stat_code).json(response)
			} catch (e: any) {
				return res.status(e.stat_code).json(e)
			}
		}
	}

	getUsersById(): Handler {
		return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
			try {
				const response: APIResponse = await this.service.getUsersById(req.params as any)
				return res.status(response.stat_code).json(response)
			} catch (e: any) {
				return res.status(e.stat_code).json(e)
			}
		}
	}

	deleteUsersById(): Handler {
		return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
			try {
				const response: APIResponse = await this.service.deleteUsersById(req.params as any)
				return res.status(response.stat_code).json(response)
			} catch (e: any) {
				return res.status(e.stat_code).json(e)
			}
		}
	}

	updateUsersById(): Handler {
		return async (req: Request, res: Response, next: NextFunction): Promise<OutgoingMessage> => {
			try {
				const response: APIResponse = await this.service.updateUsersById(req.body, req.params as any)
				return res.status(response.stat_code).json(response)
			} catch (e: any) {
				return res.status(e.stat_code).json(e)
			}
		}
	}
}
