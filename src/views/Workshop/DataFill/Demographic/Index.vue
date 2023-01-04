<template>
  <WorkContentWrap>
    <div class="table-wrap">
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton :icon="addIcon" type="primary" @click="onAddRow">添加</ElButton>
          <ElButton :icon="printIcon" type="default" @click="() => {}">打印表格</ElButton>
        </ElSpace>
      </div>
      <Table
        :loading="tableObject.loading"
        :data="tableObject.tableList"
        :columns="allSchemas.tableColumns"
        tableLayout="auto"
        row-key="id"
        headerAlign="center"
        align="center"
        highlightCurrentRow
        :show-overflow-tooltip="false"
        @register="register"
      >
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
          />
        </template>
      </Table>
    </div>

    <EditForm
      :show="dialog"
      :actionType="actionType"
      :row="tableObject.currentRow"
      :district-tree="[]"
      @close="onFormPupClose"
      @submit="onSubmit"
    />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref } from 'vue'
import { ElButton, ElMessage, ElSpace } from 'element-plus'
import { Table, TableEditColumn } from '@/components/Table'
import EditForm from './EditForm.vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getDemographicListApi,
  addDemographicApi,
  updateDemographicApi,
  delDemographicByIdApi
} from '@/api/workshop/population/service'
import { DemographicDtoType } from '@/api/workshop/population/types'

interface PropsType {
  doorNo: string
}

const props = defineProps<PropsType>()
const dialog = ref(false) // 弹窗标识
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const printIcon = useIcon({ icon: 'ion:print-outline' })

const { register, tableObject, methods } = useTable({
  getListApi: getDemographicListApi,
  delListApi: delDemographicByIdApi
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo
}

getList()

const schema = reactive<CrudSchema[]>([
  {
    type: 'index',
    field: 'index',
    label: '序号',
    fixed: true
  },
  {
    field: 'name',
    label: '姓名',
    fixed: true,
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'sex',
    label: '性别',
    width: 60,
    search: {
      show: false
    }
  },
  {
    field: 'birthday',
    label: '出生年月',
    width: 120,
    search: {
      show: false
    }
  },
  {
    field: 'card',
    label: '身份证号',
    width: 200,
    search: {
      show: false
    }
  },
  {
    field: 'nation',
    label: '民族',
    width: 80,
    search: {
      show: false
    }
  },
  {
    field: 'censusRegister',
    label: '户籍所在地',
    width: 300,
    search: {
      show: false
    }
  },
  {
    field: 'education',
    label: '文化程度',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'marital',
    label: '婚姻状况',
    width: 100,
    search: {
      show: false
    }
  },
  {
    field: 'occupation',
    label: '职业',
    width: 170,
    search: {
      show: false
    }
  },
  {
    field: 'company',
    label: '工作单位',
    width: 160,
    search: {
      show: false
    }
  },
  {
    field: 'insuranceType',
    label: '参保情况',
    width: 80,
    search: {
      show: false
    }
  },
  {
    field: 'action',
    label: '操作',
    fixed: 'right',
    width: 150,
    search: {
      show: false
    },
    form: {
      show: false
    },
    detail: {
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
    multiple
  )
}

const onAddRow = () => {
  actionType.value = 'add'
  tableObject.currentRow = null
  dialog.value = true
}

const onEditRow = (row: DemographicDtoType) => {
  actionType.value = 'edit'
  tableObject.currentRow = row
  dialog.value = true
}

const onFormPupClose = () => {
  dialog.value = false
}

const onSubmit = async (data: DemographicDtoType) => {
  if (actionType.value === 'add') {
    await addDemographicApi({
      ...data
    })
  } else {
    await updateDemographicApi({
      ...data,
      id: tableObject.currentRow?.id as number
    })
  }
  ElMessage.success('操作成功！')
  dialog.value = false
  getList()
}

const onViewRow = (row) => {
  actionType.value = 'view'
  tableObject.currentRow = row
  dialog.value = true
}
</script>