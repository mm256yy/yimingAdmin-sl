import request from '@/config/axios'
import { LandlordDtoType } from './types'

/**
 * 查询单个居民户信息
 */
export const getLandlordByIdApi = (id: number | string): Promise<LandlordDtoType> => {
  return request.get({ url: `/peasantHousehold/${id}` })
}

/**
 * 填报完成
 * @param id 居民户 ID
 * @returns
 */
export const reportLandlordApi = (id: number) => {
  return request.post({
    url: `/peasantHousehold/fillComplete/${id}`,
    headersType: 'multipart/form-data'
  })
}
