<template>
  <ElDialog
    :title="actionType === 'edit' ? '编辑自然村' : '新增自然村'"
    :model-value="props.show"
    :width="575"
    @close="onClose"
    alignCenter
    appendToBody
    :closeOnClickModal="false"
  >
    <ElForm
      class="policy-form"
      ref="formRef"
      label-position="right"
      :model="form"
      label-width="100px"
      :rules="rules"
    >
      <ElFormItem label="行政区划" prop="parentCode" required>
        <ElTreeSelect
          class="!w-full"
          v-model="form.parentCode"
          :data="props.districtTree"
          node-key="code"
          :props="treeSelectDefaultProps"
          :default-expanded-keys="[form.parentCode]"
        />
      </ElFormItem>
      <ElFormItem label="村名" prop="name" required>
        <ElInput clearable :maxlength="20" v-model="form.name" />
      </ElFormItem>

      <MapFormItem :positon="position" @change="onChosePosition" />
    </ElForm>

    <template #footer>
      <ElButton @click="onClose">取消</ElButton>
      <ElButton type="primary" @click="onSubmit(formRef)">确认</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElTreeSelect,
  FormInstance,
  FormRules,
  ElMessage
} from 'element-plus'
import { ref, reactive, watch } from 'vue'
import { MapFormItem } from '@/components/Map'
import { debounce } from 'lodash-es'
import { useValidator } from '@/hooks/web/useValidator'
import type { VillageDtoType } from '@/api/workshop/village/types'
import type { DistrictNodeType } from '@/api/district/types'

interface PropsType {
  show: boolean
  actionType: 'add' | 'edit'
  projects?: Array<{
    label: string
    value: number
  }>
  row?: VillageDtoType | null | undefined
  districtTree: DistrictNodeType[]
}
const props = defineProps<PropsType>()
const emit = defineEmits(['close', 'submit'])
const { required } = useValidator()
const formRef = ref<FormInstance>()

const treeSelectDefaultProps = {
  value: 'code',
  label: 'name'
}

const defaultValue: Omit<VillageDtoType, 'id'> = {
  address: '',
  latitude: 0,
  longitude: 0,
  name: '',
  parentCode: ''
}
const form = ref<Omit<VillageDtoType, 'id'>>(defaultValue)
const position = reactive({
  latitude: 0,
  longitude: 0,
  address: ''
})

watch(
  () => props.row,
  (val) => {
    if (val) {
      form.value = {
        ...val
      }
    } else {
      formRef.value?.resetFields()
      form.value = defaultValue
    }
    position.latitude = form.value.latitude
    position.longitude = form.value.longitude
    position.address = form.value.address
  },
  {
    immediate: true,
    deep: true
  }
)

// 规则校验
const rules = reactive<FormRules>({
  name: [required()],
  parentCode: [required()]
})

// 关闭弹窗
const onClose = () => {
  emit('close')
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
      if (!position || !position.longitude) {
        return ElMessage.error('请点击地图选择经纬度')
      }
      const data = {
        ...form.value,
        ...position
      }
      emit('submit', data)
    } else {
      return false
    }
  })
}, 600)
</script>

<style lang="less">
.policy-form {
  .el-upload-dragger {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .el-input__wrapper {
    width: 100%;
  }
}
</style>