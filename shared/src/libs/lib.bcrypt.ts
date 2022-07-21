import bcryptjs from 'bcryptjs'

export interface IPassword {
	success: boolean
	error: any
}

export class Bcrypt {
	static hashPassword(password: string): string {
		const res: string = bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))
		return res
	}

	static comparePassword(password: string, hashPassword: string): Promise<IPassword> {
		return new Promise(async (resolve, reject) => {
			await bcryptjs.compare(password, hashPassword, (error, success) => resolve({ error, success }))
		})
	}
}
