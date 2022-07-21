import { OutgoingMessage } from 'http'
import { StatusCodes as status } from 'http-status-codes'
import { Request, Response, NextFunction, Handler } from 'express'
import { JsonWebToken } from '@node/pkg'

export const permission = (roles: string[]): Handler => {
	return async function (req: Request, res: Response, next: NextFunction): Promise<NextFunction | OutgoingMessage> {
		try {
			const accessToken: string = (req.headers.authorization as string).split('Bearer ')[1]
			const decodedToken: Record<string, any> = await JsonWebToken.verifyToken({
				accessToken,
				secretOrPrivateKey: process.env.JWT_SECRET as string,
				options: {}
			})
			// const model: Repository<Roles> = new Model().model()

			console.log(decodedToken)
			// const checkRoleAccess: Roles = await model.findOne({ name: decodedToken['role'] })
			// if (!roles.includes(checkRoleAccess.name)) throw apiResponse(status.FORBIDDEN, 'Your role is not allowed')

			next()
		} catch (e: any) {
			return res.status(e.stat_code | status.FORBIDDEN).json(e)
		}
	}
}
