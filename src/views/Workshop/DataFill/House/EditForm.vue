<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑' : actionType === 'add' ? '新增' : '查看详情'"
    :model-value="props.show"
    :width="1140"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      :disabled="actionType === 'view'"
      class="form"
      ref="formRef"
      :model="form"
      label-width="124px"
      :label-position="'right'"
      :rules="rules"
    >
      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="幢号" prop="houseNo">
            <ElInput v-model="form.houseNo" placeholder="请输入幢号" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="土地使用权证编号" prop="landNo">
            <ElInput v-model="form.landNo" placeholder="请输入编号" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="房产所有权证编号" prop="propertyNo">
            <ElInput
              clearable
              filterable
              placeholder="请输入编号"
              type="text"
              v-model="form.propertyNo"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="房屋用途" prop="usageType">
            <ElSelect class="!w-full" clearable filterable v-model="form.usageType">
              <ElOption
                v-for="item in dictObj[265]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="层高" prop="storeyHeight">
            <ElInput type="number" v-model="form.storeyHeight" placeholder="请输入层高" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="层数" prop="storeyNumber">
            <ElInput type="number" v-model="form.storeyNumber" placeholder="请输入层数" />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="房屋产别" prop="propertyType">
            <ElSelect class="!w-full" clearable filterable v-model="form.propertyType">
              <ElOption
                v-for="item in dictObj[284]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="房屋类别" prop="houseType">
            <ElSelect class="!w-full" clearable filterable v-model="form.houseType">
              <ElOption
                v-for="item in dictObj[266]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="房屋高程" prop="houseHeight">
            <ElInput
              clearable
              filterable
              placeholder="请输入房屋高程"
              type="number"
              class="!w-full"
              v-model="form.houseHeight"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElDivider border-style="dashed" />

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="结构类型" prop="constructionType">
            <ElSelect class="!w-full" clearable filterable v-model="form.constructionType">
              <ElOption
                v-for="item in dictObj[252]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="屋面形式" prop="roofType">
            <ElSelect class="!w-full" clearable filterable v-model="form.roofType">
              <ElOption
                v-for="item in dictObj[246]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="屋面材料" prop="roofMaterialsType">
            <ElSelect class="!w-full" clearable filterable v-model="form.roofMaterialsType">
              <ElOption
                v-for="item in dictObj[309]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="外墙" prop="outerWallType">
            <ElSelect class="!w-full" clearable filterable v-model="form.outerWallType">
              <ElOption
                v-for="item in dictObj[280]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="内墙" prop="interiorWallType">
            <ElSelect class="!w-full" clearable filterable v-model="form.interiorWallType">
              <ElOption
                v-for="item in dictObj[257]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="地面" prop="groundType">
            <ElSelect class="!w-full" clearable filterable v-model="form.groundType">
              <ElOption
                v-for="item in dictObj[320]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="门窗" prop="doorsWindowsType">
            <ElSelect class="!w-full" clearable filterable v-model="form.doorsWindowsType">
              <ElOption
                v-for="item in dictObj[333]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="水电" prop="waterElectricityType">
            <ElSelect class="!w-full" clearable filterable v-model="form.waterElectricityType">
              <ElOption
                v-for="item in dictObj[241]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="竣工日期" prop="completedTime">
            <ElDatePicker
              class="!w-full"
              v-model="form.completedTime"
              type="month"
              placeholder="请选择日期"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="土地性质" prop="landType">
            <ElSelect class="!w-full" clearable filterable v-model="form.landType">
              <ElOption
                v-for="item in dictObj[222]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="建筑面积" prop="landArea">
            <ElInput
              clearable
              filterable
              placeholder="请输入建筑面积"
              type="number"
              class="!w-full"
              v-model="form.landArea"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="8">
          <ElFormItem label="所在位置" prop="locationType">
            <ElSelect class="w-350px" v-model="form.locationType">
              <ElOption
                v-for="item in dictObj[326]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElRow :gutter="30">
        <ElCol :span="8">
          <ElFormItem label="淹没范围" prop="inundationRange">
            <ElSelect class="!w-350px" clearable v-model="form.inundationRange">
              <ElOption
                v-for="item in dictObj[346]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect> </ElFormItem
        ></ElCol>
        <ElCol :span="8">
          <MapFormItem :required="false" :positon="position" @change="onChosePosition"
        /></ElCol>
      </ElRow>

      <ElDivider border-style="dashed" />
      <!-- :class="[actionType === 'view' && housePic.length > 0 ? 'upload' : '']" -->

      <ElFormItem label="房屋平面示意图">
        <div class="card-img-list">
          <ElUpload
            :disabled="actionType === 'view'"
            :list-type="'picture-card'"
            action="/api/file/type"
            :data="{
              type: 'image'
            }"
            accept=".jpg,.jpeg,.png"
            :multiple="false"
            :file-list="housePic"
            :headers="headers"
            :on-error="onError"
            :on-success="uploadFileChange1"
            :before-remove="beforeRemove"
            :on-remove="removeFile1"
            :on-preview="imgPreview"
            :class="[actionType === 'view' ? 'upload' : '']"
          >
            <template #trigger v-if="actionType !== 'view'">
              <div class="card-img-box">
                <img class="card-img" src="@/assets/imgs/house.png" alt="" />
                <div class="card-txt">点击上传</div>
              </div>
            </template>
          </ElUpload>
          <div
            style="display: flex; height: 88px"
            :class="[housePic.length == 0 ? 'CADuplogd' : '']"
          >
            <span style="padding: 0 12px; color: #606266">房屋平面示意图CAD格式:</span>
            <ElUpload
              :file-list="CADfile"
              :data="{
                type: 'image'
              }"
              accept=".dwg,.dws,.dxf"
              class="upload-demo"
              action="/api/file/type"
              multiple
              :headers="headers"
              :on-preview="previewClick"
              :on-success="uploadFileChangeCAD"
              :before-remove="beforeRemove"
            >
              <template #trigger v-if="actionType !== 'view'">
                <el-button type="primary">点击上传</el-button>
              </template>
            </ElUpload>
          </div>
        </div>
      </ElFormItem>

      <ElFormItem label="土地证">
        <div class="card-img-list">
          <ElUpload
            :disabled="actionType === 'view'"
            :on-error="onError"
            :list-type="'picture-card'"
            action="/api/file/type"
            :data="{
              type: 'image'
            }"
            accept=".jpg,.jpeg,.png"
            :multiple="false"
            :file-list="landPic"
            :headers="headers"
            :on-success="uploadFileChange2"
            :before-remove="beforeRemove"
            :on-remove="removeFile2"
            :on-preview="imgPreview"
            :class="[actionType === 'view' ? 'upload' : '']"
          >
            <template #trigger v-if="actionType !== 'view'">
              <div class="card-img-box">
                <img class="card-img" src="@/assets/imgs/land.png" alt="" />
                <div class="card-txt">点击上传</div>
              </div>
            </template>
          </ElUpload>
        </div>
      </ElFormItem>

      <ElFormItem label="房屋照片">
        <div class="card-img-list">
          <ElUpload
            :disabled="actionType === 'view'"
            action="/api/file/type"
            :data="{
              type: 'image'
            }"
            :on-error="onError"
            :list-type="'picture-card'"
            accept=".jpg,.jpeg,.png"
            :multiple="true"
            :file-list="homePic"
            :headers="headers"
            :on-success="uploadFileChange3"
            :before-remove="beforeRemove"
            :on-remove="removeFile3"
            :class="[actionType === 'view' ? 'upload' : '']"
            :on-preview="imgPreview"
          >
            <template #trigger v-if="actionType !== 'view'">
              <div class="card-img-box">
                <div class="card-img-custom">
                  <Icon icon="ant-design:plus-outlined" :size="22" />
                </div>
                <div class="card-txt"> 点击上传 </div>
              </div>
            </template>
          </ElUpload>
        </div>
      </ElFormItem>

      <ElFormItem label="其他附件">
        <div class="card-img-list">
          <ElUpload
            :class="[actionType === 'view' ? 'upload' : '']"
            action="/api/file/type"
            :data="{
              type: 'image'
            }"
            :on-error="onError"
            :list-type="'picture-card'"
            accept=".jpg,.jpeg,.png"
            :multiple="true"
            :file-list="otherPic"
            :headers="headers"
            :on-success="uploadFileChange4"
            :before-remove="beforeRemove"
            :on-remove="removeFile4"
            :on-preview="imgPreview"
          >
            <template #trigger v-if="actionType !== 'view'">
              <div class="card-img-box">
                <div class="card-img-custom">
                  <Icon icon="ant-design:plus-outlined" :size="22" />
                </div>
                <div class="card-txt">点击上传</div>
              </div>
            </template>
          </ElUpload>
        </div>
      </ElFormItem>

      <ElFormItem label="备注" prop="remark">
        <ElInput type="textarea" v-model="form.remark" />
      </ElFormItem>

      <ElFormItem
        v-if="
          actionType === 'add' && surveyStatus === SurveyStatusEnum.Review && type === 'Landlord'
        "
        label="新增原因"
        prop="addReason"
        required
      >
        <ElInput type="textarea" v-model="form.addReason" />
      </ElFormItem>
    </ElForm>

    <template #footer v-if="actionType !== 'view'">
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="onSubmit(formRef)">确认</ElButton>
    </template>
    <el-dialog title="查看图片" :width="920" v-model="dialogVisible">
      <img class="block w-full" :src="imgUrl" alt="Preview Image" />
    </el-dialog>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  FormInstance,
  FormRules,
  ElOption,
  ElSelect,
  ElUpload,
  ElDatePicker,
  ElDivider,
  ElRow,
  ElCol,
  ElMessageBox,
  ElMessage
} from 'element-plus'
import { ref, reactive, watch, nextTick, computed, provide } from 'vue'
import { MapFormItem } from '@/components/Map'
import { debounce } from 'lodash-es'
import type { UploadFile, UploadFiles } from 'element-plus'
import { SurveyStatusEnum } from '@/views/Workshop/components/config'
// import { useValidator } from '@/hooks/web/useValidator'
// import { locationTypes } from '@/views/Workshop/components/config'
import type { HouseDtoType } from '@/api/workshop/datafill/house-types'
import { useAppStore } from '@/store/modules/app'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { addHouseApi, updateHouseApi } from '@/api/workshop/datafill/house-service'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit' | 'view'
  row?: HouseDtoType | null | undefined
  householdId: string
  doorNo: string
  surveyStatus: SurveyStatusEnum
  type?: string
}

interface FileItemType {
  name: string
  url: string
}
const CADfile: any = ref([])

const props = defineProps<PropsType>()
provide('mapType', props.actionType)
const emit = defineEmits(['close', 'submit'])
// const { required } = useValidator()
const formRef = ref<FormInstance>()
const appStore = useAppStore()

const defaultValue: Omit<HouseDtoType, 'id'> = {
  houseNo: '',
  propertyType: '',
  usageType: '',
  houseType: '',
  constructionType: '',
  storeyNumber: '',
  completedTime: '',
  propertyNo: '',
  landNo: '',
  landType: '',
  landArea: '',
  storeyHeight: '',
  houseHeight: '',
  outerWallType: '',
  interiorWallType: '',
  groundType: '',
  roofType: '',
  roofMaterialsType: '',
  doorsWindowsType: '',
  waterElectricityType: '',
  formula: '',
  longitude: '',
  latitude: '',
  housePic: '',
  houseJpg: '',
  remark: ''
}

const dictStore = useDictStoreWithOut()

const dictObj = computed(() => dictStore.getDictObj)
const form = ref<Omit<HouseDtoType, 'id'>>(defaultValue)
const position: {
  latitude: number
  longitude: number
  address?: string
} = reactive({
  latitude: 0,
  longitude: 0
})
const housePic = ref<FileItemType[]>([])
const landPic = ref<FileItemType[]>([])
const homePic = ref<FileItemType[]>([])
const otherPic = ref<FileItemType[]>([])
const imgUrl = ref<any>()
const dialogVisible = ref<boolean>()
const loading = ref(false)

const headers = {
  'Project-Id': appStore.getCurrentProjectId,
  Authorization: appStore.getToken
}

watch(
  () => props.show,
  (val) => {
    if (!val) {
      housePic.value = []
      CADfile.value = []
      landPic.value = []
      homePic.value = []
      otherPic.value = []
    }
  }
)
const onError = () => {
  ElMessage.error('上传失败,请上传5M以内的图片或者重新上传')
}
watch(
  () => props.show,
  (val) => {
    if (val) {
      // 表单数据赋值
      form.value = {
        ...props.row
      }
      position.longitude = form.value.longitude
      position.latitude = form.value.latitude
      position.address = form.value.address

      try {
        if (form.value.housePic) {
          housePic.value = JSON.parse(form.value.housePic)
        }
        if (form.value.houseCadPic) {
          CADfile.value = JSON.parse(form.value.houseCadPic)
        }
        if (form.value.landPic) {
          landPic.value = JSON.parse(form.value.landPic)
        }
        if (form.value.homePic) {
          homePic.value = JSON.parse(form.value.homePic)
        }
        if (form.value.otherPic) {
          otherPic.value = JSON.parse(form.value.otherPic)
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      form.value = defaultValue
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 规则校验
const rules = reactive<FormRules>({})

// 关闭弹窗
const onClose = (flag = false) => {
  position.latitude = 0
  position.longitude = 0
  position.address = ''
  emit('close', flag)
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

// 定位
const onChosePosition = (ps) => {
  position.latitude = ps.latitude
  position.longitude = ps.longitude
  position.address = ps.address
}

// 提交表单
const onSubmit = debounce((formEl) => {
  formEl?.validate((valid) => {
    if (valid) {
      const data: any = {
        ...form.value,
        ...position,
        houseCadPic: JSON.stringify(CADfile.value || []),
        housePic: JSON.stringify(housePic.value || []),
        landPic: JSON.stringify(landPic.value || []),
        homePic: JSON.stringify(homePic.value || []),
        otherPic: JSON.stringify(otherPic.value || [])
      }
      loading.value = true
      submit(data)
    } else {
      return false
    }
  })
}, 600)

// 处理函数
const handleFileList = (fileList: UploadFiles, type: string) => {
  let list: FileItemType[] = []
  if (fileList && fileList.length) {
    list = fileList
      .filter((fileItem) => fileItem.status === 'success')
      .map((fileItem) => {
        return {
          name: fileItem.name,
          url: (fileItem.response as any)?.data || fileItem.url
        }
      })
  }

  if (type === 'house') {
    housePic.value = list
  } else if (type === 'houseCAD') {
    CADfile.value = list
  } else if (type === 'land') {
    landPic.value = list
  } else if (type === 'home') {
    homePic.value = list
  } else if (type === 'other') {
    otherPic.value = list
  }
  // CADfile.value
}

// 文件上传
const uploadFileChange1 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'house')
}

const uploadFileChangeCAD = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'houseCAD')
}
const uploadFileChange2 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'land')
}
const uploadFileChange3 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'home')
}
const uploadFileChange4 = (_response: any, _file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
}
const previewClick = (uploadFile: UploadFile) => {
  console.log(uploadFile.url, 'uploadFile')

  window.open(uploadFile.url)
  // window.location.href = uploadFile.url
}
// 文件移除
const removeFile1 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'house')
}
const removeFile2 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'land')
}
const removeFile3 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'home')
}
const removeFile4 = (_file: UploadFile, fileList: UploadFiles) => {
  handleFileList(fileList, 'other')
}

// 移除之前
const beforeRemove = (uploadFile: UploadFile) => {
  return ElMessageBox.confirm(`确认移除文件 ${uploadFile.name} 吗?`).then(
    () => true,
    () => false
  )
}
// 预览
const imgPreview = (uploadFile: UploadFile) => {
  imgUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const submit = async (data: HouseDtoType) => {
  if (props.actionType === 'add') {
    await addHouseApi({
      ...data,
      doorNo: props.doorNo,
      householdId: +props.householdId
    })
      .then(() => {
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  } else {
    await updateHouseApi({
      ...data,
      doorNo: props.doorNo,
      householdId: +props.householdId
    })
      .then(() => {
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  }
  ElMessage.success('操作成功！')
  onClose(true)
}
</script>
<style lang="less">
.upload {
  .el-upload--picture-card {
    display: none;
  }
}

.CADuplogd {
  margin-left: 150px;
}
</style>
