<template>
  <WorkContentWrap>
    <!-- 择址确认 —— 选房择址 -->
    <!-- houseAreaType 安置方式：homestead 宅基地，flat 公寓房，oneself 自谋出路，concentrate 集中供养 -->
    <div
      class="table-wrap !py-12px !mt-0px"
      v-if="baseInfo.houseAreaType === 'flat' || baseInfo.houseAreaType === 'homestead'"
    >
      <div class="flex items-center justify-between pb-12px">
        <div> </div>
        <ElSpace>
          <ElButton type="primary" @click="onDocumentation"> 档案上传 </ElButton>
          <!-- <ElButton
            class="!bg-[#30A952] !border-[#30A952]"
            type="primary"
            :icon="printIcon"
            @click="onPrint"
          >
            打印报表
          </ElButton> -->
        </ElSpace>
      </div>
      <ElTable v-if="baseInfo.houseAreaType === 'homestead'" :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" width="80" type="index" align="center" header-align="center" />
        <ElTableColumn label="安置区" prop="settleAddress" align="center" header-align="center">
          <template #default="{ row }">
            {{ getSettleAddress(row) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="类型" prop="houseAreaType" align="center" header-align="center">
          <template #default="{ row }">
            {{ row.houseAreaType === 'flat' ? '公寓房' : '宅基地' }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="户型/套型" prop="area" align="center" header-align="center" />
        <ElTableColumn label="地块编号" prop="landNo" align="center" header-align="center">
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择" v-model="row.landNo">
              <ElOption
                v-for="item in landNoOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                :disabled="item.isOccupy === '1'"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn label="摇号顺序号" prop="lotteryOrder" align="center" header-align="center">
          <template #default="{ row }">
            <ElInputNumber placeholder="请输入" :min="0" v-model="row.lotteryOrder" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="择址顺序号" prop="placeOrder" align="center" header-align="center">
          <template #default="{ row }">
            <ElInputNumber placeholder="请输入" :min="0" v-model="row.placeOrder" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" align="center" header-align="center" fixed="right">
          <template #default="{ row }">
            <ElButton type="primary" @click="onSave(row)"> 保存 </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElTable v-if="baseInfo.houseAreaType === 'flat'" :data="tableData" style="width: 100%">
        <ElTableColumn label="序号" width="80" type="index" align="center" header-align="center" />
        <ElTableColumn
          label="安置区"
          width="120"
          prop="settleAddress"
          align="center"
          header-align="center"
        />
        <ElTableColumn
          label="类型"
          width="100"
          prop="houseAreaType"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            {{ row.houseAreaType === 'flat' ? '公寓房' : '宅基地' }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="户型/套型"
          width="120"
          prop="area"
          align="center"
          header-align="center"
        />
        <ElTableColumn
          label="房号"
          width="140"
          prop="roomNo"
          align="center"
          header-align="center"
        />
        <ElTableColumn
          label="储藏室编号"
          width="120"
          prop="storeroomNo"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择" v-model="row.storeroomNo">
              <ElOption
                v-for="item in storeroomNoOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                :disabled="item.isOccupy === '1'"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="车位编号"
          width="120"
          prop="carNo"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElSelect clearable filterable placeholder="请选择" v-model="row.carNo">
              <ElOption
                v-for="item in carNoOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                :disabled="item.isOccupy === '1'"
              />
            </ElSelect>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="摇号顺序号"
          width="180"
          prop="lotteryOrder"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber placeholder="请输入" :min="0" v-model="row.lotteryOrder" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="择房顺序号"
          width="180"
          prop="placeOrder"
          align="center"
          header-align="center"
        >
          <template #default="{ row }">
            <ElInputNumber placeholder="请输入" :min="0" v-model="row.placeOrder" />
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="200" align="center" header-align="center" fixed="right">
          <template #default="{ row }">
            <ElButton type="primary" @click="enterRoomNo(row)">录入房号</ElButton>
            <ElButton type="primary" @click="onSave(row)"> 保存 </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <div class="table-wrap !py-12px !mt-0px no-data" v-if="!baseInfo.houseAreaType">
      该户未选择搬迁安置方式，请前往安置确认中选择搬迁安置方式
    </div>

    <div class="table-wrap !py-12px !mt-0px no-data" v-if="baseInfo.houseAreaType === 'oneself'">
      该户安置方式为自谋出路，无需选房择址
    </div>

    <div
      class="table-wrap !py-12px !mt-0px no-data"
      v-if="baseInfo.houseAreaType === 'concentrate'"
    >
      该户安置方式为集中供养，无需选房择址
    </div>

    <!-- 档案上传 -->
    <OnDocumentation
      :show="dialog"
      :door-no="props.doorNo"
      :data-list="tableData"
      :base-info="props.baseInfo"
      @close="(...event) => close(event, 'documentation')"
    />

    <!-- 录入幢号室号 -->
    <EnterRoomNo
      :show="roomNoDialog"
      :row="currentRow"
      :baseInfo="baseInfo"
      @close="(...event) => close(event, 'roomNo')"
    />
  </WorkContentWrap>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// import { useDictStoreWithOut } from '@/store/modules/dict'
// import { useIcon } from '@/hooks/web/useIcon'
import {
  ElButton,
  ElInputNumber,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElSelect,
  ElOption,
  ElMessage
} from 'element-plus'
import { WorkContentWrap } from '@/components/ContentWrap'
import OnDocumentation from './OnDocumentation.vue'
import EnterRoomNo from './EnterRoomNo.vue'
import {
  getImmigrantChooseHouseApi,
  saveImmigrantChooseHouseApi
} from '@/api/immigrantImplement/siteConfirmation/siteSel-service'
import { getChooseConfigApi } from '@/api/immigrantImplement/siteConfirmation/common-service'
import { resettleArea, apartmentArea } from '../../config'

interface PropsType {
  doorNo: string
  baseInfo: any
}

const props = defineProps<PropsType>()
// const dictStore = useDictStoreWithOut()
// const dictObj = computed(() => dictStore.getDictObj)
// const printIcon = useIcon({ icon: 'ion:print-outline' })

const tableData = ref<any[]>([])
const dialog = ref<boolean>(false)
const roomNoDialog = ref<boolean>(false)
const emit = defineEmits(['updateData'])

const landNoOptions = ref<any[]>([]) // 宅基地地块编号选项列表
const storeroomNoOptions = ref<any[]>([]) // 储藏室编号选项列表
const carNoOptions = ref<any[]>([]) // 车位号选项列表
const currentRow = ref<any>({}) // 当前行数据

// 获取列表数据
const getList = () => {
  getImmigrantChooseHouseApi(props.doorNo).then((res) => {
    tableData.value = res.content
  })
}

/**
 * 获取当前行安置区
 * @param data 当前行信息
 */
const getSettleAddress = (data: any) => {
  // 选择了公寓房的安置方式
  if (data.houseAreaType === 'flat') {
    let str = ''
    apartmentArea.map((item: any) => {
      if (item.id === data.settleAddress) {
        str = item.name
      }
    })
    return str
  } else {
    let str = ''
    resettleArea.map((item: any) => {
      if (item.id === data.settleAddress) {
        str = item.name
      }
    })
    return str
  }
}

// 获取宅基地地块编号选项列表
const getlandNoList = (name?: string) => {
  getChooseConfigApi(props.baseInfo.projectId, 2, name).then((res: any) => {
    landNoOptions.value = res.content
  })
}

// 获取储藏室编号选项列表
const getStoreroomNoList = (name?: string) => {
  getChooseConfigApi(props.baseInfo.projectId, 3, name).then((res: any) => {
    storeroomNoOptions.value = res.content
  })
}

// 获取车位编号选项列表
const getcarNoList = (name?: string) => {
  getChooseConfigApi(props.baseInfo.projectId, 4, name).then((res: any) => {
    carNoOptions.value = res.content
  })
}

const enterRoomNo = (row: any) => {
  roomNoDialog.value = true
  currentRow.value = row
}

// 归档
const onDocumentation = () => {
  dialog.value = true
}

// 打印报表
// const onPrint = () => {
//   console.log('打印报表')
// }

// 保存
const onSave = (row: any) => {
  saveImmigrantChooseHouseApi(row).then(() => {
    ElMessage.success('操作成功！')
    getList()
    emit('updateData')
  })
}

/**
 * 关闭归档/幢号室号弹窗
 * @param flag
 */
const close = (params: any[], type: string) => {
  console.log('params:', params)
  if (type === 'documentation') {
    dialog.value = false
  } else if (type === 'roomNo') {
    roomNoDialog.value = false
    if (params[0] === true) {
      getlandNoList()
      getStoreroomNoList()
      getcarNoList()
    }
  }
  if (params[0] === true) {
    getList()
  }
}

onMounted(() => {
  getList()
  getlandNoList()
  getStoreroomNoList()
  getcarNoList()
})
</script>
<style lang="less" scoped>
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  font-size: 15px;
}

.btn-txt {
  color: red;
  cursor: pointer;
}
</style>
