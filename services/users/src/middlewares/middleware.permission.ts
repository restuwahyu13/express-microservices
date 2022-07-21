import { OutgoingMessage } from 'http'
import { StatusCodes as status } from 'http-status-codes'
import { Request, Response, NextFunction, Handler } from 'express'
import { JsonWebToken, apiResponse, Inject, Middleware } from '@node/pkg'
import { Model } from 'mongoose'

import { UsersModel } from '@models/model.users'
import { IUsers } from '@interfaces/interface.users'

@Middleware()
export class PermissionMiddleware {
  constructor(@Inject('UsersModel') private users: UsersModel) {}

  use(roles: string[]): Handler {
    let users: Model<IUsers> = this.users.model

    return async function (req: Request, res: Response, next: NextFunction): Promise<NextFunction | OutgoingMessage> {
      try {
        const accessToken: string = (req.headers.authorization as string).split('Bearer ')[1]
        const decodedToken: Record<string, any> = await JsonWebToken.verifyToken({ accessToken, secretOrPrivateKey: process.env.JWT_SECRET_KEY as string })

        const checkRoleAccess: IUsers = await users.findById(decodedToken['id']).populate({ path: 'roleId', select: '_id name' }).lean()
        if (!roles.includes(checkRoleAccess.roleId['name'])) throw apiResponse(status.FORBIDDEN, 'Your role is not allowed')

        next()
      } catch (e: any) {
        return res.status(e.stat_code | status.FORBIDDEN).json(e)
      }
    }
  }
}
