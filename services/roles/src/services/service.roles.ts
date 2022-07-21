import { StatusCodes as status } from 'http-status-codes'
import { Inject, Service, apiResponse, APIResponse } from '@node/pkg'

import { RolesModel } from '@models/model.roles'
import { IRoles } from '@interfaces/interface.roles'
import { DTORolesId, DTORoles } from '@dtos/dto.roles'

@Service()
export class RolesService {
  constructor(@Inject('RolesModel') private roles: RolesModel) {}

  async createRoles(body: DTORoles): Promise<APIResponse> {
    try {
      const checkRoles: IRoles | null = await this.roles.model.findOne({ name: body.name, deletedAt: null })
      if (checkRoles) throw apiResponse(status.BAD_REQUEST, `Role name ${body.name} already exist`)

      const createRoles: IRoles | null = await this.roles.model.create(body)
      if (!createRoles) throw apiResponse(status.FORBIDDEN, 'Create new role failed')

      return Promise.resolve(apiResponse(status.OK, 'Create new role success'))
    } catch (e: any) {
      return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async getAllRoles(): Promise<APIResponse> {
    try {
      const getAllRoles: IRoles[] = await this.roles.model.find({})

      return Promise.resolve(apiResponse(status.OK, 'Roles already to use', getAllRoles, null))
    } catch (e: any) {
      return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async getRolesById(params: DTORolesId): Promise<APIResponse> {
    try {
      const getRole: IRoles | null = await this.roles.model.findOne({ _id: params.id, deletedAt: null })
      if (!getRole) throw apiResponse(status.BAD_REQUEST, 'Role data is not exist')

      return Promise.resolve(apiResponse(status.OK, 'Role already to use', getRole, null))
    } catch (e: any) {
      return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async deleteRolesById(params: DTORolesId): Promise<APIResponse> {
    try {
      const getRole: IRoles | null = await this.roles.model.findOne({ _id: params.id, deletedAt: null })
      if (!getRole) throw apiResponse(status.BAD_REQUEST, 'Role data is not exist')

      const deleteRole: any = await this.roles.model.findOneAndUpdate({ _id: getRole._id, deletedAt: new Date() })
      if (!deleteRole) throw apiResponse(status.FORBIDDEN, 'Deleted role data failed')

      return Promise.resolve(apiResponse(status.OK, 'Deleted role data success'))
    } catch (e: any) {
      return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async updateRolesById(body: DTORoles, params: DTORolesId): Promise<APIResponse> {
    try {
      const getRole: IRoles | null = await this.roles.model.findOne({ _id: params.id, deletedAt: null })
      if (!getRole) throw apiResponse(status.BAD_REQUEST, 'Role data is not exist')

      const updateRole: any = await this.roles.model.findOneAndUpdate({ _id: getRole._id, $addToSet: { access: body.access } })
      if (!updateRole) throw apiResponse(status.FORBIDDEN, 'Updated Role data failed')

      return Promise.resolve(apiResponse(status.OK, 'Updated role data success'))
    } catch (e: any) {
      return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }
}
