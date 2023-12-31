import request from '@/config/axios'
import type { FamilyIncomeInfoType } from './types'

/**
 * 分页读取家庭收入项配置列表
 */
export const listFamilyIncomeApi = (type): Promise<TableResponse<FamilyIncomeInfoType>> => {
  return request.get({ url: 'immigrant_income_config?configType=' + type })
}

/**
 * 新增或编辑家庭收入项配置
 */
export const saveFamilyIncomeApi = (
  FamilyIncome: FamilyIncomeInfoType,
  type
): Promise<FamilyIncomeInfoType> => {
  const url = FamilyIncome.id
    ? '/immigrant_income_config/update'
    : '/immigrant_income_config/create'
  return request.post({ url, data: { ...FamilyIncome, configType: type } })
}

/**
 * 删除家庭收入项配置
 * @param id 用户id
 */
export const deleteFamilyIncomeApi = (id: number): Promise<void> => {
  return request.post({ url: `/immigrant_income_config/delete/${id}` })
}
