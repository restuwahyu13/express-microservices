import { StatusCodes as status } from 'http-status-codes'
import { Inject, Service, apiResponse, APIResponse, Bcrypt, IPassword, JsonWebToken, expiredAt, dateFormat } from '@node/pkg'
import { assert } from 'is-any-type'
import { AddressInfo } from 'net'

import { UsersModel } from '@models/model.users'
import { SecretsModel } from '@models/model.secrets'
import { RolesModel } from '@models/model.roles'
import { IUsers } from '@interfaces/interface.users'
import { ISecrets } from '@interfaces/interface.secrets'
import { IRoles } from '@interfaces/interface.roles'
import { DTOLogin, DTORegister, DTOUsersId, DTOUsers, DTOHealthToken, DTORevokeToken, DTORefreshToken, DTOUsersPagination } from '@dtos/dto.users'

@Service()
export class UsersService {
  private name: string

  constructor(@Inject('UsersModel') private users: UsersModel, @Inject('SecretsModel') private secrets: SecretsModel, @Inject('RolesModel') private roles: RolesModel) {
    this.name = 'Users Service'
  }

  async registerUsers(ipAddress: string, body: DTORegister): Promise<APIResponse> {
    try {
      const checkUser: IUsers = await this.users.model.findOne({ email: body.email, deletedAt: null })
      if (checkUser) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, `Email ${body.email} already taken`)

      const checkRoleName: IRoles = await this.roles.model.findOne({ name: body.role })
      if (!checkRoleName) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, `Role name ${body.role} is not exist`)

      if (checkRoleName.name == 'admin') body.active = true
      else body.active = true

      body.password = Bcrypt.hashPassword(body.password)

      const createUsers: IUsers = await this.users.model.create({ name: body.name, email: body.email, password: body.password, active: body.active, roleId: checkRoleName._id })
      if (!createUsers) throw apiResponse(this.name, ipAddress, status.FORBIDDEN, 'Register new user account failed')

      return Promise.resolve(apiResponse(this.name, ipAddress, status.OK, 'Register new user account success'))
    } catch (e: any) {
      return Promise.reject(apiResponse(this.name, ipAddress, e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async loginUsers(ipAddress: string, body: DTOLogin): Promise<APIResponse> {
    try {
      const getUser: IUsers = await this.users.model.findOne({ email: body.email, deletedAt: null }).populate({ path: 'roleId', select: '_id name', model: this.roles.model }).lean()

      if (!getUser) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, 'Email is not registered')
      if (!getUser.active) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, 'User account is not active, please contact admin')

      const isCompare: IPassword = await Bcrypt.comparePassword(body.password, getUser.password)
      if (!isCompare.success) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, 'Email or password failed')

      const token: Record<string, any> = JsonWebToken.signToken({
        payload: { id: getUser._id, email: getUser.email, role: getUser.roleId['name'] },
        secretOrPrivateKey: process.env.JWT_SECRET_KEY as string,
        options: { expiresIn: '1d', audience: 'node' }
      })

      const isAccessTokenExpired: string = expiredAt(1, 'days')
      const isRefreshTokenExpired: string = expiredAt(30, 'days') // by default set in 30 days in shared module for jwt libs

      await this.secrets.model.create({
        ...token,
        resourceType: 'login',
        resourceBy: getUser._id,
        expiredAt: isAccessTokenExpired
      })

      const loginRes: Record<string, any> = {
        ...token,
        accessTokenExpired: isAccessTokenExpired,
        refreshTokenExpired: isRefreshTokenExpired,
        role: getUser.roleId['name']
      }

      return Promise.resolve(apiResponse(this.name, ipAddress, status.OK, 'Login success', loginRes, null))
    } catch (e: any) {
      return Promise.reject(apiResponse(this.name, ipAddress, e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async refreshTokenUsers(ipAddress: string, body: DTORefreshToken): Promise<APIResponse> {
    try {
      const getAccessToken: ISecrets = await this.secrets.model.findOne({ accessToken: body.accessToken, resourceType: 'login' }).sort({ _id: -1 })

      if (!getAccessToken) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, 'AccessToken is not exist')
      if (dateFormat(getAccessToken.expiredAt) > dateFormat(new Date())) throw apiResponse(this.name, ipAddress, status.OK, 'Your accessToken is not expired')

      const getUser: IUsers = await this.users.model.findOne({ _id: getAccessToken.resourceBy, deletedAt: null }).populate({ path: 'roleId', select: '_id name', model: this.roles.model }).lean()

      const token: string = JsonWebToken.refreshToken({
        payload: { id: getUser._id, email: getUser.email, role: getUser.roleId['name'] },
        secretOrPrivateKey: process.env.JWT_SECRET_KEY as string,
        options: { expiresIn: '1d', audience: 'node' }
      })

      const isAccessTokenExpired: string = expiredAt(1, 'days')
      await this.secrets.model.findByIdAndUpdate(getAccessToken._id, {
        $set: { accessToken: token, resourceType: 'login', resourceBy: getUser._id, expiredAt: isAccessTokenExpired }
      })

      const tokenRes: Record<string, any> = {
        accessToken: token,
        accessTokenExpired: isAccessTokenExpired,
        role: getUser.roleId['name']
      }

      return Promise.resolve(apiResponse(this.name, ipAddress, status.OK, 'Refresh accessToken success', tokenRes, null))
    } catch (e: any) {
      return Promise.reject(apiResponse(this.name, ipAddress, e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async healthTokenUsers(ipAddress: string, user: DTOHealthToken): Promise<APIResponse> {
    try {
      if (assert.isUndefined(user as any)) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, 'AccessToken expired')
      const getAccessToken: ISecrets = await this.secrets.model.findOne({ resourceBy: user.id }).sort({ _id: -1 })

      if (!getAccessToken) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, 'AccessToken is not exist')
      if (dateFormat(getAccessToken.expiredAt) < dateFormat(new Date())) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, 'AccessToken expired')

      return Promise.resolve(apiResponse(this.name, ipAddress, status.OK, 'Health accessToken success'))
    } catch (e: any) {
      return Promise.reject(apiResponse(this.name, ipAddress, e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async revokeTokenUsers(ipAddress: string, user: DTORevokeToken): Promise<APIResponse> {
    try {
      const deleteAccessToken: ISecrets = await this.secrets.model.findOneAndDelete({ resourceBy: user.id }).sort({ _id: -1 })
      if (!deleteAccessToken) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, 'Revoke accessToken failed')

      return Promise.resolve(apiResponse(this.name, ipAddress, status.OK, 'Revoke accessToken success'))
    } catch (e: any) {
      return Promise.reject(apiResponse(this.name, ipAddress, e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async createUsers(ipAddress: string, body: DTOUsers): Promise<APIResponse> {
    try {
      const checkUser: IUsers = await this.users.model.findOne({ email: body.email, deletedAt: null })
      if (!checkUser) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, 'Email already taken')

      const checkRoleName: IRoles = await this.roles.model.findOne({ name: body.role })
      if (!checkRoleName) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, `Role name ${body.role} is not exist`)

      body.password = Bcrypt.hashPassword(body.password)

      const createUsers: IUsers = await this.users.model.create({ name: body.name, email: body.email, password: body.password, active: body.active, roleId: checkRoleName._id })
      if (!createUsers) throw apiResponse(this.name, ipAddress, status.FORBIDDEN, 'Create new users account failed')

      return Promise.resolve(apiResponse(this.name, ipAddress, status.OK, 'Create new users account success', 'checkUser', null))
    } catch (e: any) {
      return Promise.reject(apiResponse(this.name, ipAddress, e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async getAllUsers(ipAddress: string, query: DTOUsersPagination): Promise<APIResponse> {
    try {
      if (!query.hasOwnProperty('limit') && !query.hasOwnProperty('offset') && !query.hasOwnProperty('sort')) {
        query.page = 10
        query.limit = 10
        query.offset = 0
        query.sort = 'asc' ? 1 : -1
      }

      let getAllUsers: IUsers[] = []

      if (query.hasOwnProperty('filter') && JSON.parse(query.filter as any) == true) {
        const schemaFields: string[] = Object.keys(this.users.model.schema['paths'])
        const groupQuery: string[] = Object.keys(query)

        const getKey: any = schemaFields.find((val: string) => groupQuery.indexOf(val) !== -1 && val)
        const getValue: any = schemaFields.find((val: string) => query[val] && val)

        if (!getKey && !getValue) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, 'filter schema field not valid')

        getAllUsers = await this.users.model
          .find({}, { __v: 0 })
          .where({ [getKey]: query[getValue] })
          .limit(query.limit)
          .skip(query.offset)
          .sort({ _id: query.sort })
      } else {
        getAllUsers = await this.users.model.find({}, { __v: 0 }).limit(query.limit).skip(query.offset).sort({ _id: query.sort })
      }

      const currentPage: number = 1
      const countData: number = await this.users.model.count()
      const totalPage: number = Math.ceil(countData / query.page)

      const pagination: Record<string, any> = {
        count: countData,
        limit: +query.limit,
        offset: +query.offset,
        currentPage: +query.offset > 0 ? currentPage + 1 : currentPage,
        perPage: +query.page,
        totalPage: totalPage
      }

      return Promise.resolve(apiResponse(this.name, ipAddress, status.OK, 'Users already to use', getAllUsers, pagination))
    } catch (e: any) {
      return Promise.reject(apiResponse(this.name, ipAddress, e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async getUsersById(ipAddress: string, params: DTOUsersId): Promise<APIResponse> {
    try {
      const getUser: IUsers = await this.users.model.findOne({ _id: params.id, deletedAt: null }, { __v: 0 })
      if (!getUser) throw apiResponse(this.name, ipAddress, status.BAD_REQUEST, 'User data is not exist')

      return Promise.resolve(apiResponse(this.name, ipAddress, status.OK, 'User already to use', getUser, null))
    } catch (e: any) {
      return Promise.reject(apiResponse(this.name, ipAddress, e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async deleteUsersById(ipAddress: string, params: DTOUsersId): Promise<APIResponse> {
    try {
      const deleteUser: any = await this.users.model.findOneAndUpdate({ _id: params.id, deletedAt: null }, { active: false, deletedAt: new Date() })
      if (!deleteUser) throw apiResponse(this.name, ipAddress, status.FORBIDDEN, 'Deleted users data failed')

      return Promise.resolve(apiResponse(this.name, ipAddress, status.OK, 'Deleted users data success'))
    } catch (e: any) {
      return Promise.reject(apiResponse(this.name, ipAddress, e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async updateUsersById(ipAddress: string, body: DTOUsers, params: DTOUsersId): Promise<APIResponse> {
    try {
      const updateUser: any = await this.users.model.findOneAndUpdate({ _id: params.id, deletedAt: null }, { $set: { ...body } })
      if (!updateUser) throw apiResponse(this.name, ipAddress, status.FORBIDDEN, 'Updated users data failed')

      return Promise.resolve(apiResponse(this.name, ipAddress, status.OK, 'Updated users data success'))
    } catch (e: any) {
      return Promise.reject(apiResponse(this.name, ipAddress, e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }
}
