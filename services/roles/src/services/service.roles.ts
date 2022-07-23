import { StatusCodes as status } from 'http-status-codes'
import { Inject, Service, apiResponse, APIResponse } from '@node/pkg'

import { RolesModel } from '@models/model.roles'
import { IRoles } from '@interfaces/interface.roles'
import { DTORolesId, DTORoles, DTORolePagination } from '@dtos/dto.roles'

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

  async getAllRoles(query: DTORolePagination): Promise<APIResponse> {
    try {
      if (!query.hasOwnProperty('limit') && !query.hasOwnProperty('offset') && !query.hasOwnProperty('sort')) {
        query.page = 10
        query.limit = 10
        query.offset = 0
        query.sort = 'asc' ? 1 : -1
      }

      let getAllRoles: IRoles[] = []

      if (query.hasOwnProperty('filter') && JSON.parse(query.filter as any) == true) {
        const schemaFields: string[] = Object.keys(this.roles.model.schema['paths'])
        const groupQuery: string[] = Object.keys(query)

        const getKey: any = schemaFields.find((val: string) => groupQuery.indexOf(val) !== -1 && val)
        const getValue: any = schemaFields.find((val: string) => query[val] && val)

        if (!getKey && !getValue) throw apiResponse(status.BAD_REQUEST, 'filter schema field not valid')

        getAllRoles = await this.roles.model
          .find({}, { __v: 0 })
          .where({ [getKey]: query[getValue] })
          .limit(query.limit)
          .skip(query.offset)
          .sort({ _id: query.sort })
      } else {
        getAllRoles = await this.roles.model.find({}, { __v: 0 }).limit(query.limit).skip(query.offset).sort({ _id: query.sort })
      }

      const countData: number = await this.roles.model.count()
      const totalPage: number = Math.ceil(countData / query.page)

      const pagination: Record<string, any> = {
        count: countData,
        limit: +query.limit,
        offset: +query.offset,
        currentPage: 1,
        perPage: +query.page,
        totalPage: totalPage
      }

      return Promise.resolve(apiResponse(status.OK, 'Roles already to use', getAllRoles, pagination))
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
      const deleteRole: any = await this.roles.model.findOneAndUpdate({ _id: params.id, $set: { deletedAt: new Date() } })
      if (!deleteRole) throw apiResponse(status.FORBIDDEN, 'Deleted role data failed')

      return Promise.resolve(apiResponse(status.OK, 'Deleted role data success'))
    } catch (e: any) {
      return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }

  async updateRolesById(body: DTORoles, params: DTORolesId): Promise<APIResponse> {
    try {
      const updateRole: any = await this.roles.model.findOneAndUpdate({ _id: params.id, deletedAt: null }, { $set: { ...body } })
      if (!updateRole) throw apiResponse(status.FORBIDDEN, 'Updated Role data failed')

      return Promise.resolve(apiResponse(status.OK, 'Updated role data success'))
    } catch (e: any) {
      return Promise.reject(apiResponse(e.stat_code || status.BAD_REQUEST, e.stat_message || e.message))
    }
  }
}
