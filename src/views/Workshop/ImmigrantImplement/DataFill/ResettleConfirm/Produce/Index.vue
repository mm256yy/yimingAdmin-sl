<template>
  <WorkContentWrap>
    <!-- 安置确认 —— 生产安置 -->
    <div class="table-wrap !py-12px !mt-0px">
      <div class="formBox mt-5">
        <ElForm
          :disabled="actionType === 'view'"
          class="form"
          ref="formRef"
          :model="form"
          label-width="100px"
          :label-position="'right'"
          :rules="rules"
        >
          <div class="titleBox">
            <span class="text">生产安置人数统计：</span>
          </div>
          <div style="display: flex">
            <ElFormItem label="家庭总人数" prop="familyNum">
              <div class="!w-120px">{{ baseInfo.familyNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="农村移民" prop="familyNum">
              <div class="!w-120px">{{ baseInfo.ruralMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="非农村移民" prop="familyNum">
              <div class="!w-120px">{{ baseInfo.unruralMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="农业随迁" prop="familyNum">
              <div class="!w-120px">{{ baseInfo.farmingMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="非农业随迁" prop="familyNum">
              <div class="!w-120px">{{ baseInfo.unfarmingMigrantNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
          </div>
          <!-- <div style="display: flex">
            <ElFormItem label="增计人口" prop="familyNum">
              <div class="!w-150px">{{ baseInfo.addPopulationNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="其他人口" prop="familyNum">
              <div class="!w-150px">{{ baseInfo.otherPopulationNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
            <ElFormItem label="安置总人数" prop="familyNum">
              <div class="!w-150px">{{ baseInfo.familyNum }}&nbsp; <span>(人)</span></div>
            </ElFormItem>
          </div> -->
        </ElForm>
      </div>

      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="onDocumentation" style="margin-top: 17px">
            档案上传
          </ElButton>
          <ElButton
            :icon="addIcon"
            type="primary"
            @click="onImportDataPre"
            style="margin-top: 17px"
          >
            导入模拟数据
          </ElButton>
          <ElButton :icon="saveIcon" type="primary" @click="onSave" style="margin-top: 17px">
            保存
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
        <template #settingWay="{ row }">
          <el-select v-model="row.settingWay" placeholder="请选择" :key="row.id">
            <el-option
              v-for="item in filterWay(row)"
              :key="`${item.value}${row.id}`"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </template>
        <template #settingRemark="{ row }">
          <el-input v-model="row.settingRemark" placeholder="请输入" />
        </template>
      </Table>
    </div>

    <el-dialog title="提示" v-model="dialogVisible" width="500">
      <div style="display: flex; margin-bottom: 10px">
        导入模拟数据后，列表中的安置方式将被覆盖，请确认是否导入？
      </div>
      <template #footer>
        <ElButton @click="onClose">取消</ElButton>
        <ElButton type="primary" @click="onSubmit">确认</ElButton>
      </template>
    </el-dialog>

    <!-- 档案上传 -->
    <OnDocumentation :show="dialog" :door-no="props.doorNo" @close="closeDocumentation" />
  </WorkContentWrap>
</template>

<script lang="ts" setup>
import { WorkContentWrap } from '@/components/ContentWrap'
import { reactive, ref, onMounted, computed } from 'vue'
import {
  ElButton,
  ElSpace,
  ElDialog,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElForm,
  ElMessage
} from 'element-plus'
import { Table } from '@/components/Table'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useTable } from '@/hooks/web/useTable'
import { useIcon } from '@/hooks/web/useIcon'
import {
  getProduceListApi,
  saveProduceListApi
} from '@/api/immigrantImplement/resettleConfirm/produce-service'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getSimulateDemographicApi } from '@/api/workshop/datafill/mockResettle-service'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { cloneDeep } from 'lodash-es'
import OnDocumentation from './OnDocumentation.vue' // 引入档案上传组件

const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)

dayjs.extend(relativeTime)

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
const actionType = ref<'add' | 'edit' | 'view'>('add') // 操作类型
const addIcon = useIcon({ icon: 'ant-design:plus-outlined' })
const saveIcon = useIcon({ icon: 'mingcute:save-line' })
const dialog = ref<boolean>(false)

// 属实
const mockList = ref<any>([])

const { register, tableObject, methods } = useTable({
  getListApi: getProduceListApi
})
const { getList } = methods

// 根据户号来做筛选
tableObject.params = {
  doorNo: props.doorNo,
  projectId: props.baseInfo.projectId,
  status: props.baseInfo.status
}

getList()

const form = ref<any>({})
const rules = ref<any>({})
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
    field: 'populationNatureText',
    label: '人口性质',
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
    field: 'settingWay',
    label: '安置方式',
    search: {
      show: false
    }
  },
  {
    field: 'settingRemark',
    label: '备注',
    search: {
      show: false
    }
  }
])

const { allSchemas } = useCrudSchemas(schema)
const dialogVisible = ref(false)

onMounted(() => {
  getMockList()
})

/**
 * 安置方式过滤
 */
const filterWay = (data) => {
  const arr = cloneDeep(dictObj.value[375]).map((item) => {
    // 农村移民的 其他性质
    const notFarmer = data.populationNature !== '1'
    if (notFarmer && item.value === '1') {
      item.disabled = true
    }
    data.age = data.birthday ? parseInt(dayjs(data.birthday).fromNow().replace(/\D+/, '')) : 0
    if (+data.age < 14 && item.value !== '3') {
      item.disabled = true
    }
    return item
  })
  return arr
}

// 获取模拟数据
const getMockList = async () => {
  const res = await getSimulateDemographicApi({
    doorNo: props.doorNo,
    projectId: props.baseInfo.projectId,
    status: props.baseInfo.status
  })
  if (res && res.content && res.content.length) {
    mockList.value = res.content
  }
}

// 导入
const onImportDataPre = async () => {
  dialogVisible.value = true
}

// 导入数据
const onImportData = async () => {
  // 拿到模拟安置的配置
  if (mockList.value && mockList.value.length) {
    console.log(mockList.value, '导入的内容')
    // 模拟数据和当前数据做融合
    tableObject.tableList = tableObject.tableList.map((item) => {
      const current = mockList.value.find((mockItem) => mockItem.demographicId === item.id)
      if (current) {
        item.settingWay = current.settingWay
        item.settingRemark = current.settingRemark
      }
      return item
    })
  }
}

// 打开档案上传弹窗
const onDocumentation = () => {
  dialog.value = true
}

// 关闭档案上传弹窗
const closeDocumentation = () => {
  dialog.value = false
}

const onClose = () => {
  dialogVisible.value = false
}

const onSubmit = () => {
  dialogVisible.value = false
  onImportData()
}

const onSave = async () => {
  const item = tableObject.tableList.find((item) => !item.settingWay)
  if (item) {
    ElMessage.info('请选择安置方式')
    return
  }
  const params = tableObject.tableList.map((item) => {
    return {
      ...item,
      settingWay: item.settingWay,
      settingRemark: item.settingRemark
    }
  })

  const res = await saveProduceListApi(params)
  if (res) {
    ElMessage.success('保存成功！')
  }
}
</script>
<style lang="less" scoped>
:deep(.el-dialog__body) {
  padding-right: 60px;
  padding-left: 60px;
}

:deep(.el-form-item) {
  padding: 0 10px;
}

.formBox {
  border: 1px solid #ebebeb;
  border-radius: 4px;
  opacity: 1;

  .titleBox {
    height: 32px;
    padding-left: 15px;
    margin: 0px 0 16px;
    line-height: 32px;
    background: #f5f7fa;
    box-shadow: 0px 1px 0px 0px rgba(235, 235, 235, 1);

    .text {
      padding-left: 15px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-size: 17px;
      font-weight: 600;
      color: #171718;

      border-left: 4px solid rgba(62, 115, 236, 1) !important;
    }
  }
}
</style>
