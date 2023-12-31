<template>
  <div class="flex items-center">
    <ElButton
      @click="onBack"
      :icon="BackIcon"
      type="default"
      class="px-9px py-0px !h-28px mr-8px !text-12px"
    >
      返回
    </ElButton>
    <ElBreadcrumb separator="/">
      <ElBreadcrumbItem class="text-size-12px"> 移民实施 </ElBreadcrumbItem>
      <ElBreadcrumbItem class="text-size-12px"> 专业项目 </ElBreadcrumbItem>
    </ElBreadcrumb>
  </div>

  <div class="data-fill-head">
    <div class="head-top">
      <div class="tabs">
        <div
          :class="['tab-item', tabCurrentId === item.id ? 'active' : '']"
          v-for="item in tabsList"
          :key="item.id"
          @click="onTabClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <BaseInfo :baseInfo="baseInfo" :tabCurrentId="tabCurrentId" />
  </div>

  <!-- 居民户 -->
  <div class="data-fill-body">
    <!-- 协议签订 -->
    <signing-agreement
      v-if="tabCurrentId == 1"
      :baseInfo="baseInfo"
      @update-data="getProfessionalInfo"
    />

    <!-- 进度管理 -->
    <schedule-management
      :professionalId="professionalId"
      :projectId="projectId"
      v-if="tabCurrentId === 2"
    />

    <!-- 合同管理 -->
    <contract-management :professionalId="professionalId" v-if="tabCurrentId === 3" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ElBreadcrumb, ElBreadcrumbItem, ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { getProfessionalProjectByIdApi } from '@/api/professional/service'
import BaseInfo from '../components/BaseInfo.vue' // 用户基本信息
import SigningAgreement from './SigningAgreement/Index.vue' // 协议签订
import ScheduleManagement from './ScheduleManagement/Index.vue' // 进度管理
import ContractManagement from './ContractManagement/Index.vue' // 合同管理
import { useRouter } from 'vue-router'

const { currentRoute, back } = useRouter()
const baseInfo = ref<any>({})
const tabCurrentId = ref<number>(1)
const { projectId, professionalId } = currentRoute.value.query as any
const BackIcon = useIcon({ icon: 'iconoir:undo' })
const tabsList = [
  {
    id: 1,
    name: '协议签订'
  },
  {
    id: 2,
    name: '进度管理'
  },
  {
    id: 3,
    name: '合同管理'
  }
]

// 专业项目详情
const getProfessionalInfo = () => {
  if (!professionalId) return
  getProfessionalProjectByIdApi(professionalId).then((res) => {
    baseInfo.value = res
  })
}

getProfessionalInfo()

const onTabClick = (tabItem) => {
  if (tabCurrentId.value === tabItem.id) {
    return
  }
  tabCurrentId.value = tabItem.id
}

const onBack = () => {
  back()
}
</script>

<style lang="less" scoped>
.data-fill-head {
  position: relative;
  padding: 14px 16px;
  margin-top: 6px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 4px 6px 0px rgba(33, 63, 98, 0.17);

  .head-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tabs {
    display: flex;
    align-items: center;

    .tab-item {
      display: flex;
      height: 32px;
      padding: 0 20px;
      margin-right: 4px;
      font-size: 14px;
      color: #000;
      cursor: pointer;
      background: #f0f2f7;
      border-radius: 10px 10px 0px 0px;
      align-items: center;

      &.active {
        color: #fff;
        background-color: var(--el-color-primary);
      }
    }
  }
}

.report-tabs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .report-tab-item {
    display: flex;
    height: 32px;
    padding: 0 16px;
    margin: 14px 8px 0 0;
    font-size: 14px;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    align-items: center;

    .tit {
      margin-left: 6px;
      // user-select: none;
    }

    &.active {
      color: var(--el-color-primary);
      background: #e9f0ff;
      border: 1px solid var(--el-color-primary);
    }
  }
}

.data-fill-body {
  padding-top: 10px;
  margin-top: -10px;
  background-color: #fff;
}

.report-dialog {
  .report-cont {
    padding: 22px 55px;
    margin: 0 auto;
    background: #f5f7fa;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .report-item {
      display: flex;
      height: 32px;
      font-size: 14px;
      line-height: 32px;
      align-items: center;

      .report-tit {
        margin-right: 16px;
        color: rgba(19, 19, 19, 0.6);
        text-align: right;
      }

      .report-txt {
        font-weight: 500;
        color: var(--text-color-1);
      }
    }
  }

  .tips {
    display: flex;
    align-items: center;
    margin-top: 16px;
    font-size: 14px;
    color: var(--text-color-1);
  }
}
</style>

<style lang="less">
.el-divider--horizontal {
  margin: 8px 0 24px;
}

.report-dialog {
  .el-dialog__body {
    padding: 16px 40px !important;
  }
}

.datafill-content {
  padding: 12px 16px 16px;
  background: #ffffff;
  border-radius: 4px;
}
</style>
