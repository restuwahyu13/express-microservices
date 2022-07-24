import { StatusCodes as status } from 'http-status-codes'
import { Request, Response, NextFunction, Handler } from 'express'
import { JsonWebToken, apiResponse, Middleware, Inject, dateFormat } from '@node/pkg'
import { OutgoingMessage, IncomingHttpHeaders } from 'http'
import { Model } from 'mongoose'
import { assert } from 'is-any-type'
import { SecretsModel } from '@models/model.secrets'
import { ISecrets } from '@/interfaces/interface.secrets'

@Middleware()
export class AuthMiddleware {
  constructor(@Inject('SecretsModel') private secrets: SecretsModel) {}

  use(): Handler {
    let secrets: Model<ISecrets> = this.secrets.model

    return async function (req: Request, res: Response, next: NextFunction): Promise<NextFunction | OutgoingMessage> {
      try {
        let headers: IncomingHttpHeaders = req.headers
        if (!Object.keys(headers).includes('authorization')) throw apiResponse('Users Service', req.socket.localAddress, status.UNAUTHORIZED, 'Authorization is required')

        const authorization: boolean | undefined = (headers.authorization as string).includes('Bearer')
        if (!authorization) throw apiResponse('Users Service', req.socket.localAddress, status.UNAUTHORIZED, 'Bearer is required')

        const accessToken: string = (headers.authorization as string).split('Bearer ')[1]
        if (assert.isUndefined(accessToken as any)) throw apiResponse('Users Service', req.socket.localAddress, status.UNAUTHORIZED, 'Access Token is required')

        const validJwt: string[] = (accessToken as string).split('.')
        if (validJwt?.length !== 3) throw apiResponse('Users Service', req.socket.localAddress, status.UNAUTHORIZED, 'Access Token format must be jwt')

        const decodedToken: Record<string, any> = await JsonWebToken.verifyToken({ accessToken, secretOrPrivateKey: process.env.JWT_SECRET_KEY as string })

        const getAccessToken: ISecrets = await secrets.findOne({ resourceBy: decodedToken['id'] }).sort({ _id: -1 })
        if (!getAccessToken) throw apiResponse('Users Service', req.socket.localAddress, status.UNAUTHORIZED, 'Access token is not exist')

        if (dateFormat(getAccessToken.expiredAt) < dateFormat(new Date())) throw apiResponse('Users Service', req.socket.localAddress, status.UNAUTHORIZED, 'Access token expired')
        Object.defineProperty(req, 'user', { value: decodedToken, enumerable: true, writable: true })

        next()
      } catch (e: any) {
        return res.status(e.stat_code || status.UNAUTHORIZED).json(e)
      }
    }
  }
}
