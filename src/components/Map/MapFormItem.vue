<template>
  <el-form-item label="经纬度" :required="!!props.required">
    <el-popover
      placement="top"
      width="424"
      trigger="click"
      @show="showPop"
      popper-class="popper-class"
    >
      <Map ref="mapRef" :h="400" :point="position" @chose="onChosePosition" v-if="mapShow" />
      <!-- :model-value="position.longitude ? `${position.longitude},${position.latitude}` : ''" -->
      <template #reference>
        <div class="flex items-center w-full">
          <el-input
            class="!w-350px"
            v-model="seatData"
            clearable
            placeholder="请选择位置"
            style="cursor: pointer"
            @change="inputchange"
          />
          <!-- :suffix-icon="locationIcon" -->
          <!-- <el-tooltip placement="top" content="请点击地图选择经纬度">
            <Icon class="ml-5px" icon="bi:question-circle" color="#231815" />
          </el-tooltip> -->
          <Icon class="ml-10px" icon="fa6-solid:map-location-dot" color="var(--el-color-primary)" />
        </div>
      </template>
      <div v-if="position.address">{{ position.address }}</div>
    </el-popover>
  </el-form-item>
</template>

<script setup lang="ts">
// nextTick,
import { ref, watch, reactive } from 'vue'
import { ElPopover, ElInput, ElFormItem } from 'element-plus'
import { Map } from '@/components/Map'
const seatData = ref('')
interface PositionType {
  latitude: number
  longitude: number
  address?: string
}
interface PropsType {
  positon?: PositionType
  required?: boolean
}

const props = defineProps<PropsType>()
const emit = defineEmits(['change'])
const mapShow = ref()
const mapRef = ref()
const position: PositionType = reactive({
  latitude: 0,
  longitude: 0,
  address: ''
})

watch(
  () => props.positon,
  (value) => {
    if (value) {
      position.longitude = value.longitude
      position.latitude = value.latitude
      position.address = value.address
    } else {
      position.longitude = 0
      position.latitude = 0
      position.address = ''
    }
    if (position.longitude) {
      seatData.value = position.longitude + ',' + position.latitude
    } else {
      seatData.value = ''
    }
  },
  {
    immediate: true,
    deep: true
  }
)
const onChosePosition = (ps: PositionType) => {
  if (position.longitude) {
    seatData.value = position.longitude + ',' + position.latitude
  } else {
    seatData.value = ''
  }

  position.longitude = ps.longitude
  position.latitude = ps.latitude
  position.address = ps.address
  emit('change', ps)
}
const inputchange = (val) => {
  let ps: any = {}
  position.longitude = val.slice(0, val.indexOf(','))
  position.latitude = val.slice(val.indexOf(',') + 1)

  ps.longitude = val.slice(0, val.indexOf(','))
  ps.latitude = val.slice(val.indexOf(',') + 1)

  emit('change', ps)
}
const showPop = () => {
  mapShow.value = true

  // nextTick(() => {
  //   mapRef.value?.resize()
  // })
}
</script>
<style>
.amap-sug-result {
  z-index: 2999 !important;
}
</style>
