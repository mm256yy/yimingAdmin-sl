<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div class="title"> 居民户账户信息 </div>
      </div>
      <ElForm
        class="form"
        ref="formRef"
        :model="form"
        label-width="70px"
        :label-position="'right'"
        :rules="rules"
      >
        <ElRow>
          <ElCol :span="6">
            <ElFormItem label="开户名" prop="relation">
              <ElInput v-model="form.accountName" placeholder="请输入" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="开户行" prop="relation">
              <ElInput v-model="form.bankName" placeholder="请输入" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem label="开户账号" prop="relation">
              <ElInput v-model="form.bankAccount" placeholder="请输入" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElButton type="primary" @click="onDocumentation">归档</ElButton>
            <ElButton type="primary" @click="onPrint">打印报表</ElButton>
            <ElButton type="primary" @click="onSubmit(formRef)">保存</ElButton>
          </ElCol>
        </ElRow>
      </ElForm>

      <div class="flex items-center justify-between pb-12px">
        <div class="title"> 家庭基本情况列表</div>
      </div>
      <Table
        v-model:pageSize="tableObject.size"
        v-model:currentPage="tableObject.currentPage"
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        row-key="id"
        headerAlign="center"
        align="center"
        :pagination="{
          total: tableObject.total
        }"
        highlightCurrentRow
        @register="register"
      >
        <template #birthday="{ row }">
          <div>
            {{ standardFormatDate(row.birthday) }}
          </div>
        </template>
      </Table>

      <div class="flex items-center justify-between pb-12px mt-20px">
        <div class="title"> 费用补偿情况列表</div>
        <ElSpace>
          <ElButton type="primary" @click="confirmReward">奖励费确认</ElButton>
        </ElSpace>
      </div>
      <div class="fylist">
        <ElTable
          :data="feeTableData"
          :span-method="objectSpanMethod"
          style="width: 100%"
          class="mb-20"
          :row-class-name="tableRowClassName"
          :border="true"
        >
          <ElTableColumn label="类型" align="center" prop="type" header-align="center">
            <template #default="{ row }">
              <b>{{ getTypeStr(row.type) }}</b>
            </template>
          </ElTableColumn>
          <ElTableColumn label="指标名称" prop="name" align="center" header-align="center" />
          <ElTableColumn label="单位" width="100" prop="unit" align="center" header-align="center">
            <template #default="{ row }">
              {{ row.unit ? row.unit : '——' }}
            </template>
          </ElTableColumn>
          <ElTableColumn label="数量" prop="number" align="center" header-align="center">
            <template #default="{ row }">
              <div v-if="row.isUpdate === '1' && row.isVerify === '1'">{{ row.number }}</div>
              <div v-if="row.isUpdate !== '1'"> —— </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="补偿单价" prop="price" align="center" header-align="center">
            <template #default="{ row }">
              <div v-if="row.isUpdate === '1' && row.isVerify === '1'">{{ row.price }}</div>
              <div v-if="row.isUpdate !== '1'"> —— </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            label="补偿金额"
            width="100"
            prop="totalPrice"
            align="center"
            header-align="center"
          >
            <template #default="{ row }">
              <div v-if="row.isUpdate === '0'">{{ row.totalPrice }}</div>
              <div v-else-if="row.isUpdate === '1'">{{ computedTotalPrice(row) }}</div>
              <div v-else-if="row.isUpdate === '2'"> {{ getSummaries(row) }} </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="备注" prop="remark" align="center" header-align="center">
            <template #default="{ row }">
              <div v-if="row.isUpdate === '1' && row.isVerify === '1'">{{ row.remark }}</div>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
      <div class="pb-12px mt-20px">
        <div class="title"> 备注</div>
        <div class="text">1. 补偿费、异地搬迁补助费、奖励费等拨付至甲方指定银行</div>
        <div class="text mt-20px">
          2. 搬迁补助费、过渡资金补助费、其他补助费、临时安置补助费拨付至乙方指定银行。
        </div>
        <div class="text mt-20px">
          3.临时安置补助费首次发放时间为乙方腾空被拆迁房屋并办理交付手续之日起十五日内，每半年发放一次，截止时间为安置房选房的当月。
        </div>
      </div>
    </div>

    <!-- 档案上传 -->
    <OnDocumentation :show="dialog" :door-no="props.doorNo" @close="close('documentation')" />

    <!-- 奖励费确认 -->
    <ConfirmReward
      :show="rewardConfirmDialog"
      :door-no="props.doorNo"
      @close="close('rewardConfirm')"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import {
  ElTable,
  ElTableColumn,
  FormInstance,
  ElForm,
  ElFormItem,
  FormRules,
  ElRow,
  ElCol,
  ElButton,
  ElInput,
  ElMessage
} from 'element-plus'
import { debounce } from 'lodash-es'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { standardFormatDate } from '@/utils/index'
import { getDemographicListApi, delDemographicByIdApi } from '@/api/workshop/population/service'
import {
  updatePeasantHouseholdInfo,
  getCompensationCardList
} from '@/api/immigrantImplement/createCard/service'

import { WorkContentWrap } from '@/components/ContentWrap'
import OnDocumentation from './OnDocumentation.vue' // 引入档案上传组件
import ConfirmReward from './ConfirmReward.vue' // 引入奖励费确认组件
import { onMounted } from 'vue'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const dialog = ref<boolean>(false)
const rewardConfirmDialog = ref<boolean>(false)
const emit = defineEmits(['updateData'])

const { register, tableObject, methods } = useTable({
  getListApi: getDemographicListApi,
  delListApi: delDemographicByIdApi
})
const { getList } = methods

const feeTableData = ref<any[]>([]) // 费用补偿情况列表

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  console.log(row, column)
  if (columnIndex === 0) {
    if (rowIndex === 0) {
      return {
        rowspan: 10,
        colspan: 1
      }
    } else if (rowIndex === 10) {
      return {
        rowspan: 17,
        colspan: 1
      }
    } else if (rowIndex === 27) {
      return {
        rowspan: 7,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  } else if (columnIndex === 1) {
    if (rowIndex === 17) {
      return {
        rowspan: 3,
        colspan: 1
      }
    } else if (rowIndex === 18) {
      return {
        rowspan: 1,
        colspan: 0
      }
    } else if (rowIndex === 19) {
      return {
        rowspan: 1,
        colspan: 0
      }
    } else if (rowIndex === 20) {
      return {
        rowspan: 2,
        colspan: 1
      }
    } else if (rowIndex === 21) {
      return {
        rowspan: 1,
        colspan: 0
      }
    } else if (rowIndex === 22) {
      return {
        rowspan: 3,
        colspan: 1
      }
    } else if (rowIndex === 23) {
      return {
        rowspan: 1,
        colspan: 0
      }
    } else if (rowIndex === 24) {
      return {
        rowspan: 1,
        colspan: 0
      }
    }
  }
}

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo,
  status: props.baseInfo.status
}

getList()

const schema = reactive<CrudSchema[]>([
  {
    width: 80,
    type: 'index',
    field: 'index',
    label: '序号'
  },
  {
    field: 'name',
    label: '姓名',
    search: {
      show: false
    }
  },
  {
    field: 'relationText',
    label: '与户主关系',
    search: {
      show: false
    }
  },
  {
    field: 'sexText',
    label: '性别',
    search: {
      show: false
    }
  },

  {
    field: 'censusTypeText',
    label: '户籍册类别',
    search: {
      show: false
    }
  },
  {
    width: 180,
    field: 'card',
    label: '身份证号',
    search: {
      show: false
    }
  },
  {
    field: 'maritalText',
    label: '婚姻状况',
    search: {
      show: false
    }
  },
  {
    field: 'populationNatureText',
    label: '人口性质',
    search: {
      show: false
    }
  },
  {
    field: 'remark',
    label: '备注',
    search: {
      show: false
    }
  },
  {
    field: 'addReasonText',
    label: '新增原因',
    search: {
      show: false
    }
  }
])

const tableRowClassName = ({ row }: any) => {
  if (
    row.name &&
    (row.name.includes('小计') || row.name.includes('合计')) &&
    row.name !== '其他费用/专项费小计'
  ) {
    return 'gray-row'
  } else {
    return ''
  }
}
const { allSchemas } = useCrudSchemas(schema)

const formRef = ref<FormInstance>()
const form = ref<any>({ ...props.baseInfo })
const rules = reactive<FormRules>({})

// 获取费用补偿情况列表
const getRewardFeeList = () => {
  getCompensationCardList(props.doorNo).then((res: any) => {
    feeTableData.value = res
  })
}

/**
 * 获取金额类型
 * @param type 类型 1 补偿, 2 补助, 3 奖励, 4 其他
 */
const getTypeStr = (type: string) => {
  switch (type) {
    case '1':
      return '补偿费'
      break
    case '2':
      return '补助费'
      break
    case '3':
      return '奖励费'
      break
    case '4':
      return '其他费用'
      break
    default:
      return ''
  }
}

/**
 * 计算补偿金额
 * 补偿金额 = 数量 * 单价
 * @param row 当前行数据
 */
const computedTotalPrice = (row: any) => {
  if (row.totalPrice) {
    return Number(row.totalPrice)
  } else {
    if (row.number && row.price) {
      return Number(row.number) * Number(row.price)
    } else {
      return 0
    }
  }
}

/**
 * 获取奖励小计
 * @param row 当前行信息
 */
const getSummaries = (row: any) => {
  let sums = 0
  let sumIndex = 0
  feeTableData.value.forEach((column, index) => {
    if (column.name === row.name) {
      sumIndex = index
    }
  })
  const arr = feeTableData.value.filter((item, index) => item && index !== sumIndex)
  sums = arr.reduce((totalPrice, currentItem) => {
    return totalPrice + computedTotalPrice(currentItem)
  }, 0)
  return sums
}

// 归档
const onDocumentation = () => {
  dialog.value = true
}

// 打印报表
const onPrint = () => {
  console.log('打印报表')
}

// 奖励费确认
const confirmReward = () => {
  rewardConfirmDialog.value = true
}

// 关闭弹窗
const close = (type: string) => {
  if (type === 'documentation') {
    dialog.value = false
  } else if (type === 'rewardConfirm') {
    rewardConfirmDialog.value = false
    getRewardFeeList()
  }
}

// 表单提交
const submit = (data: any) => {
  updatePeasantHouseholdInfo(data).then((res: any) => {
    if (res) {
      ElMessage.success('操作成功')
      emit('updateData')
    }
  })
}

// 保存
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid: any) => {
    if (valid) {
      const data: any = {
        ...form.value
      }
      submit(data)
    } else {
      return false
    }
  })
}, 600)

onMounted(() => {
  getRewardFeeList()
})
</script>
<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding-right: 60px;
  padding-left: 60px;
}

:deep(.el-form-item) {
  padding: 0 10px;
}

.title {
  margin: 5px 0;
  font-family: PingFang SC-Bold, PingFang SC;
  font-size: 16px;
  font-weight: bold;
  color: #171718;
}

.fylist {
  el-pagination {
    display: none !important;
  }
}

.text {
  font-family: PingFang SC-Regular, PingFang SC;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
}

:deep(.fylist .gray-row .el-table__cell) {
  background: #ebebeb;
}

:deep(.fylist .el-table .name-row) {
  border-right: none;
}

:deep(.fylist .el-table__body .el-table__row:nth-child(18) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.fylist .el-table__body .el-table__row:nth-child(21) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.fylist .el-table__body .el-table__row:nth-child(23) .name-row) {
  border-right: 1px solid #e5e7eb;
}

:deep(.fylist .el-table--border::before) {
  background: #fff;
}

:deep(.fylist .el-table__border-left-patch) {
  width: 0;
}

:deep(.fylist .el-table--border::after) {
  background: #fff;
}

:deep(.fylist .el-table--border .el-table__inner-wrapper::after) {
  background: #fff;
}
</style>
