import request from '@/config/axios'
import { AccessoryDtoType } from './accessory-types'

/**
 * 查询附属物信息列表
 */

export const getAccessoryListApi = (
  query: Partial<AccessoryDtoType>
): Promise<TableResponse<AccessoryDtoType>> => {
  return request.get({ url: '/immigrant_appendant', params: query })
}

/**
 * 保存
 */
export const saveAccessoryListApi = (data: any): Promise<TableResponse<AccessoryDtoType>> => {
  return request.post({ url: '/immigrant_appendant/createAll', data })
}
