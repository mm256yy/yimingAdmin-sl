<template>
  <!--档案管理通用图片弹框-->
  <ElDialog :title="props.title" width="600px" :model-value="props.isShow" @close="closeDialog">
    <div v-if="showList" class="display-wrapper">
      <div
        v-for="(item, index) in fileList"
        :key="index"
        class="image-wrapper"
        @click="onImageClick(item)"
      >
        <ElImage
          style="width: 80px; height: 80px"
          :preview-src-list="[item.url]"
          :src="item.url"
          fit="cover"
        />
        <div class="image-txt" :title="item.name">{{ formatText(item.name) }}</div>
      </div>
    </div>
    <ElEmpty v-else description="暂无数据" />
  </ElDialog>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { ElDialog, ElImage, ElEmpty } from 'element-plus'
import type { FilesDtoType } from '@/api/fileMng/types'
interface PropType {
  title: string // 弹框标题
  isShow: boolean //是否展示
  files: string // 文件
}

const props = defineProps<PropType>()
const fileList = ref<FilesDtoType[]>([])
const showList = computed(() => {
  return fileList.value && fileList.value.length > 0
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

watch(
  () => props.isShow,
  () => {
    parseData()
  }
)

const parseData = () => {
  if (!props.files) return
  fileList.value = JSON.parse(props.files)
  console.log('res', fileList.value)
}

//关闭弹窗
const closeDialog = () => {
  emit('close')
}

const onImageClick = (item: FilesDtoType) => {
  console.log('item-click', item)
}

const formatText = (str: string) => {
  return str.length > 12 ? str.substring(0, 10) + '...' : str
}
</script>

<style lang="less" scoped>
.display-wrapper {
  display: flex;
  max-height: 800px;
  margin: 0 auto;
  overflow-y: auto;
  flex-wrap: wrap;
  justify-content: flex-start;

  .image-wrapper {
    display: flex;
    width: 25%;
    padding: 20px;
    margin-right: 40px;
    cursor: pointer;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;

    .image-txt {
      margin-top: 8px;
      font-size: 16px;
      color: #171718;
    }
  }
}
</style>
