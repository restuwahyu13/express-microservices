import { StatusCodes as status } from 'http-status-codes'
import { Inject, Service, apiResponse, APIResponse, Bcrypt, IPassword, JsonWebToken } from '@node/pkg'

import { UsersModel } from '@models/model.users'
import { IUsers } from '@interfaces/interface.users'
import { DTOLogin, DTORegister, DTOUsersId, DTOUsers } from '@dtos/dto.users'

@Service()
export class UsersService {
	constructor(@Inject('UsersModel') private users: UsersModel) {}

	async registerUsers(body: DTORegister): Promise<APIResponse> {
		try {
			const checkUser: IUsers | null = await this.users.model.findOne({ email: body.email, deletedAt: null })
			if (!checkUser) throw apiResponse(status.BAD_REQUEST, 'Email already taken')

			body.password = Bcrypt.hashPassword(body.password)

			const createUsers: IUsers | null = await this.users.model.create(body)
			if (!createUsers) throw apiResponse(status.FORBIDDEN, 'Register new user account failed')

			return Promise.resolve(apiResponse(status.OK, 'Register new user account success', 'checkUser', null))
		} catch (e: any) {
			return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
		}
	}

	async loginUsers(body: DTOLogin): Promise<APIResponse> {
		try {
			const getUser: IUsers | null = await this.users.model.findOne({ email: body.email, deletedAt: null })
			if (!getUser) throw apiResponse(status.BAD_REQUEST, 'Email is not registered')

			const isCompare: IPassword = await Bcrypt.comparePassword(body.password, getUser.password)
			if (!isCompare.success) throw apiResponse(status.BAD_REQUEST, 'Email or password failed')

			const token: Record<string, any> = JsonWebToken.signToken({
				payload: { id: getUser._id, email: getUser.email },
				secretOrPrivateKey: process.env.JWT_SECRET as string,
				options: { expiresIn: '1d', audience: 'node' }
			})

			return Promise.resolve(apiResponse(status.OK, 'Login success', token, null))
		} catch (e: any) {
			return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
		}
	}

	async createUsers(body: DTOUsers): Promise<APIResponse> {
		try {
			const checkUser: IUsers | null = await this.users.model.findOne({ email: body.email, deletedAt: null })
			if (!checkUser) throw apiResponse(status.BAD_REQUEST, 'Email already taken')

			body.password = Bcrypt.hashPassword(body.password)

			const createUsers: IUsers | null = await this.users.model.create(body)
			if (!createUsers) throw apiResponse(status.FORBIDDEN, 'Create new users account failed')

			return Promise.resolve(apiResponse(status.OK, 'Create new users account success', 'checkUser', null))
		} catch (e: any) {
			return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
		}
	}

	async getAllUsers(): Promise<APIResponse> {
		try {
			const getAllUsers: IUsers[] = await this.users.model.find({})

			return Promise.resolve(apiResponse(status.OK, 'Users already to use', getAllUsers, null))
		} catch (e: any) {
			return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
		}
	}

	async getUsersById(params: DTOUsersId): Promise<APIResponse> {
		try {
			const getUser: IUsers | null = await this.users.model.findOne({ _id: params.id, deletedAt: null })
			if (!getUser) throw apiResponse(status.BAD_REQUEST, 'Users data is not exist')

			return Promise.resolve(apiResponse(status.OK, 'Users already to use', getUser, null))
		} catch (e: any) {
			return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
		}
	}

	async deleteUsersById(params: DTOUsersId): Promise<APIResponse> {
		try {
			const getUser: IUsers | null = await this.users.model.findOne({ _id: params.id, deletedAt: null })
			if (!getUser) throw apiResponse(status.BAD_REQUEST, 'Users data is not exist')

			const deleteUser: any = await this.users.model.findOneAndUpdate({ _id: params.id, deletedAt: new Date() })
			if (!deleteUser) throw apiResponse(status.FORBIDDEN, 'Deleted users data failed')

			return Promise.resolve(apiResponse(status.OK, 'Deleted users data success'))
		} catch (e: any) {
			return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
		}
	}

	async updateUsersById(body: DTOUsers, params: DTOUsersId): Promise<APIResponse> {
		try {
			const getUser: IUsers | null = await this.users.model.findOne({ _id: params.id, deletedAt: null })
			if (!getUser) throw apiResponse(status.BAD_REQUEST, 'Users data is not exist')

			const updateUser: any = await this.users.model.findOneAndUpdate({ _id: params.id, ...body })
			if (!updateUser) throw apiResponse(status.FORBIDDEN, 'Updated users data failed')

			return Promise.resolve(apiResponse(status.OK, 'Updated users data success'))
		} catch (e: any) {
			return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
		}
	}
}
