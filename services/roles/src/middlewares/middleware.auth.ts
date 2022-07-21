import { StatusCodes as status } from 'http-status-codes'
import { Request, Response, NextFunction, Handler } from 'express'
import { JsonWebToken, apiResponse, Middleware } from '@node/pkg'
import { OutgoingMessage, IncomingHttpHeaders } from 'http'
import { assert } from 'is-any-type'

@Middleware()
export class AuthMiddleware {
  use(): Handler {
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
        Object.defineProperty(req, 'user', { value: decodedToken, enumerable: true, writable: true })

        next()
      } catch (e: any) {
        return res.status(e.stat_code || status.UNAUTHORIZED).json(e)
      }
    }
  }
}