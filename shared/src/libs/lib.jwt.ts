import jwt from 'jsonwebtoken'

export interface ISignToken {
	payload: Record<string, any>
	secretOrPrivateKey: string
	options: jwt.SignOptions | undefined
}

export interface IVerifyToken {
	accessToken: string
	secretOrPrivateKey: string
	options?: jwt.SignOptions | undefined
}

export interface IDecodeToken {
	accessToken: string
	options?: jwt.DecodeOptions | undefined
}

export interface IHealthToken {
	accessToken: string
	secretOrPrivateKey: string
	options?: jwt.SignOptions | undefined
}

export class JsonWebToken {
	static signToken(config: ISignToken): Record<string, any> {
		const accessToken: string = jwt.sign(config.payload, config.secretOrPrivateKey, config.options)
		const refreshToken: string = JsonWebToken.refreshToken({
			payload: config.payload,
			secretOrPrivateKey: config.secretOrPrivateKey,
			options: { expiresIn: '30d' }
		})
		return { accessToken, refreshToken }
	}

	static verifyToken(config: IVerifyToken): Record<string, any> {
		return jwt.verify(config.accessToken, config.secretOrPrivateKey, config.options) as any
	}

	static decodeToken(config: IDecodeToken): Record<string, any> {
		return jwt.decode(config.accessToken, config.options) as any
	}

	static healthToken(config: IHealthToken): string {
		const currentTime: number = Date.now() / 1000
		const token: any = jwt.verify(config.accessToken, config.secretOrPrivateKey, config.options)

		if (token.exp < currentTime) return 'accessToken expired'
		return 'accessToken healthy'
	}

	static refreshToken(config: ISignToken): string {
		return jwt.sign(config.payload, config.secretOrPrivateKey, config.options)
	}
}
