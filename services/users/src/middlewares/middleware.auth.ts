import { StatusCodes as status } from 'http-status-codes'
import { Request, Response, NextFunction, Handler } from 'express'
import { JsonWebToken, apiResponse, dateFormat, Injectable, Inject, Middleware } from '@node/pkg'
import { OutgoingMessage, IncomingHttpHeaders } from 'http'
import { assert } from 'is-any-type'
import { Model } from 'mongoose'

import { IUsers } from '@interfaces/interface.users'
import { ISecrets } from '@interfaces/interface.secrets'
import { UsersModel } from '@models/model.users'
import { SecretsModel } from '@models/model.secrets'

@Middleware()
export class AuthMiddleware {
  constructor(@Inject('UsersModel') private users: UsersModel, @Inject('SecretsModel') private secrets: SecretsModel) {}

  use(): Handler {
    let users: Model<IUsers> = this.users.model
    let secrets: Model<ISecrets> = this.secrets.model

    return async function (req: Request, res: Response, next: NextFunction): Promise<NextFunction | OutgoingMessage> {
      try {
        let headers: IncomingHttpHeaders = req.headers
        if (!Object.keys(headers).includes('authorization')) throw apiResponse(status.UNAUTHORIZED, 'Authorization is required')

        const authorization: boolean | undefined = (headers.authorization as string).includes('Bearer')
        if (!authorization) throw apiResponse(status.UNAUTHORIZED, 'Bearer is required')

        const accessToken: string = (headers.authorization as string).split('Bearer ')[1]
        if (assert.isUndefined(accessToken as any)) throw apiResponse(status.UNAUTHORIZED, 'Access Token is required')

        const validJwt: string[] = (accessToken as string).split('.')
        if (validJwt?.length !== 3) throw apiResponse(status.UNAUTHORIZED, 'Access Token format must be jwt')

        const decodedToken: Record<string, any> = await JsonWebToken.verifyToken({ accessToken, secretOrPrivateKey: process.env.JWT_SECRET_KEY as string })
        const checkToken: ISecrets = await secrets.findOne({ resourceBy: decodedToken['id'] }).sort({ _id: -1 }).lean()

        if (!checkToken) throw apiResponse(status.UNAUTHORIZED, 'Access token is not exist')
        if (checkToken.accessToken !== accessToken) throw apiResponse(status.UNAUTHORIZED, 'Access token invalid')

        const datenow: string = dateFormat(new Date())
        const expiredAt: string = dateFormat(checkToken.expiredAt)
        if (expiredAt < datenow) throw apiResponse(status.UNAUTHORIZED, 'Access token expired')

        const getUsers: IUsers = await users.findOne({ _id: checkToken.resourceBy }).lean()
        if (!getUsers) throw apiResponse(status.UNAUTHORIZED, `Users for this id ${checkToken.resourceBy}, is not exist`)

        // set users for global data request like this -> req.user
        Object.defineProperty(req, 'user', { value: getUsers, enumerable: true, writable: true })

        next()
      } catch (e: any) {
        return res.status(e.stat_code || status.UNAUTHORIZED).json(e)
      }
    }
  }
}
