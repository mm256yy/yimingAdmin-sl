export interface FamilyIncomeDtoType {
  id: number
  doorNo: string
  householdId: number
  sort: string
  type: string
  name: string
  amount: number
  remark: string
  [key: string]: any
}

export interface FamilyIncomeOptionType {
  id: number
  sort: string
  type: string
  name: string
  projectId: number
}
