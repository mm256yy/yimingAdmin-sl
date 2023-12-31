<template>
  <WorkContentWrap>
    <div class="table-wrap !py-12px !mt-0px">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加</ElButton>
          <ElButton @click="recordClick" v-if="surveyStatus === SurveyStatusEnum.Review">
            修改日志
          </ElButton>
        </ElSpace>
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
        <template #action="{ row }">
          <TableEditColumn
            :view-type="'link'"
            :icons="[
              {
                icon: '',
                tooltip: '详情',
                type: 'primary',
                action: () => onViewRow(row)
              }
            ]"
            :row="row"
            @edit="onEditRow(row)"
            @delete="onDelRow"
            :delete="row.relation == 1 ? false : true"
          />
        </template>
      </Table>
    </div>

    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :doorNo="props.doorNo"
      :survey-status="surveyStatus"
      @close="onFormPupClose"
    />
    <RecordListDialog
      type="人口信息"
      :isReason="true"
      :recordShow="recordShow"
      @close="recordClose"
      :doorNo="doorNo"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref } from 'vue'
import { ElButton, ElSpace } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import { getDemographicListApi, delDemographicByIdApi } from '@/api/workshop/population/service'
import { DemographicDtoType } from '@/api/workshop/population/types'
import { standardFormatDate } from '@/utils/index'
import RecordListDialog from '../components/RecordListDialog.vue'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'

interface PropsType {
  doorNo: string
  surveyStatus: SurveyStatusEnum
}

const props = defineProps<PropsType>()
const emit = defineEmits(['updateInfo'])
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const recordShow = ref(false)
const { register, tableObject, methods } = useTable({
  getListApi: getDemographicListApi,
  delListApi: delDemographicByIdApi
})
const { getList } = methods
// review
// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo
}

getList()
const recordClose = () => {
  recordShow.value = false
}
const schema = reactive<CrudSchema[]>([
  {
    width: 80,
    type: 'index',
    field: 'index',
    label: '序号'
  },
  {
    width: 100,
    field: 'name',
    label: '姓名',
    search: {
      show: false
    }
  },
  {
    width: 100,
    field: 'relationText',
    label: '与户主关系',
    search: {
      show: false
    }
  },
  {
    width: 80,
    field: 'sexText',
    label: '性别',
    search: {
      show: false
    }
  },

  {
    field: 'birthday',
    label: '出生日期',
    search: {
      show: false
    },
    width: 120,
    showOverflowTooltip: false
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
    field: 'nationText',
    label: '民族',
    search: {
      show: false
    }
  },
  {
    width: 250,
    field: 'censusRegister',
    label: '户籍所在地',
    search: {
      show: false
    }
  },
  {
    field: 'educationText',
    label: '文化程度',
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
    field: 'populationTypeText',
    label: '人口类型',
    search: {
      show: false
    }
  },
  // {
  //   field: 'occupationText',
  //   label: '职业',
  //   search: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'company',
  //   label: '工作单位',
  //   search: {
  //     show: false
  //   }
  // },
  // {
  //   field: 'insuranceTypeText',
  //   label: '参保情况',
  //   search: {
  //     show: false
  //   }
  // },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 130,
    search: {
      show: false
    },
    form: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)

const onDelRow = async (row: DemographicDtoType | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as number],
    multiple,
    true,
    props.surveyStatus === SurveyStatusEnum.Review
  )
  emit('updateInfo')
}

const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}
const recordClick = () => {
  recordShow.value = true
}
const onEditRow = (row: DemographicDtoType) => {
  console.log(row)

  actionType.value = 'edit'
  tableObject.currentRow = {
    ...row,
    occupation: row.occupation ? JSON.parse(row.occupation) : '',
    insuranceType: row.insuranceType ? row.insuranceType.split(',') : ''
  }
  dialog.value = true
}

const onFormPupClose = (flag: boolean) => {
  dialog.value = false
  if (flag === true) {
    getList()
    emit('updateInfo')
  }
}

const onViewRow = (row: DemographicDtoType) => {
  actionType.value = 'view'
  tableObject.currentRow = {
    ...row,
    occupation: row.occupation ? JSON.parse(row.occupation) : '',
    insuranceType: row.insuranceType ? row.insuranceType.split(',') : ''
  }
  dialog.value = true
}
</script>
