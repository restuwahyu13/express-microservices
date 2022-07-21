import { OutgoingMessage } from 'http'
import { StatusCodes as status } from 'http-status-codes'
import { Request, Response, NextFunction, Handler } from 'express'
import { JsonWebToken, apiResponse, Middleware } from '@node/pkg'

@Middleware()
export class PermissionMiddleware {
  use(roles: string[]): Handler {
    return async function (req: Request, res: Response, next: NextFunction): Promise<NextFunction | OutgoingMessage> {
      try {
        const accessToken: string = (req.headers.authorization as string).split('Bearer ')[1]
        const decodedToken: Record<string, any> = await JsonWebToken.verifyToken({ accessToken, secretOrPrivateKey: process.env.JWT_SECRET_KEY as string })

        if (!roles.includes(decodedToken['role'])) throw apiResponse(status.FORBIDDEN, 'Your role is not allowed')
        next()
      } catch (e: any) {
        return res.status(e.stat_code | status.FORBIDDEN).json(e)
      }
    }
  }
}
